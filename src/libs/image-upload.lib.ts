import { Injectable, HttpException, HttpStatus, ForbiddenException, BadRequestException, Logger } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { join, extname } from 'path';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { v4 as uuid } from 'uuid';
import { Buffer } from 'buffer';
import { FileUpload } from "graphql-upload"
import { buffer } from 'stream/consumers';
import { ImageUploadInput } from '../libs/dto/image-upload.input';
import { I18nService } from 'nestjs-i18n';
import { UploadpaperInput } from 'src/paper/dto/admin/uploadPaper.input';
import { Readable } from 'stream';
config();
@Injectable()
export class ImageUploadLib {

  private imageMimeTypes = [
    'image/jpg',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/bmp',
    "application/pdf"
  ];

  private uploadMethod: string;
  private uploadDir: string;
  private uploadProfilePicturePath: string;
  private profilePictureBasePath: string;
  private maxFileSize: number = 5000000;

  private AWS_S3_BUCKET: string;
  private AWS_ACCESS_KEY_ID: string;
  private AWS_SECRET_ACCESS_KEY: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly i18n: I18nService
  ) {
    this.uploadMethod = this.configService.get('UPLOAD_METHOD');
    this.uploadDir = 'public/' + this.configService.get('UPLOAD_DIR');
    this.uploadProfilePicturePath = join(process.cwd() + '/' + this.uploadDir + "/" + "avatar" + "/");
    this.profilePictureBasePath = this.configService.get('DOMAIN') + '/' + this.configService.get('UPLOAD_DIR');

    this.AWS_S3_BUCKET = this.configService.get('AWS_S3_BUCKET');
    this.AWS_ACCESS_KEY_ID = this.configService.get('AWS_ACCESS_KEY_ID');
    this.AWS_SECRET_ACCESS_KEY = this.configService.get('AWS_SECRET_ACCESS_KEY');

  }

  async imageUpload(image, dir: string, user: any) {

    // this.uploadProfilePicturePath = this.uploadProfilePicturePath + '/' + dir + '/';

    
    if (this.uploadMethod == 'local') {
      return this.localUplaod(image, user);
    } else if (this.uploadMethod == 'aws') {
      return this.awsUpload(image, dir, user);
    } else {
      return new ForbiddenException(this.i18n.t('lib.VALID_UPLOAD_METHOD'));
    }

  }

  async localUplaod(image, user: any): Promise<any> {
    
    const { originalname, mimetype, encoding } = await image;
    const createReadStream = await Readable.from(image.buffer);
    const getMimeType = this.imageMimeTypes.includes(mimetype);
    await this.checkFileSize(createReadStream, this.maxFileSize);


    if (!getMimeType) {
      throw new BadRequestException(`Unsupported file type ${extname(originalname)}`)
    }

    const newName: string = uuid() + extname(originalname);

    if (!existsSync(this.uploadProfilePicturePath)) {
      console.log("inside");
      
      mkdirSync(this.uploadProfilePicturePath, { recursive: true });
    }
    const stream = new Readable();
    stream.push(image.buffer);
    stream.push(null); // End of stream

    return new Promise(async (resolve, reject) =>
      stream
        .pipe(createWriteStream(this.uploadProfilePicturePath + newName))
        .on('finish', () => resolve(newName))
        .on('error', () => resolve(false))
    );
  }

  async awsUpload(image, dir: string, user: any): Promise<any> {
    user = null
    const { originalname, mimetype } = await image;
    const createReadStream = await Readable.from(image.buffer);
    const getMimeType = this.imageMimeTypes.includes(mimetype);
    if (!getMimeType) {
      throw new BadRequestException(`Unsupported file type ${extname(originalname)}`)
    }

    let filesize = 0;
    return await new Promise((resolves, rejects) => {
      const stream = new Readable();
      stream.push(image.buffer);
      stream.push(null); // End of stream
      stream.on('data', async (chunk: Buffer) => {
        filesize += chunk.length;
        if (filesize > this.maxFileSize) {
          rejects(new BadRequestException(this.i18n.t('lib.FILE_LESS_THAN_5MB')));
        }
      });
      stream.on('end', async () => {
        const newName: string = uuid() + extname(originalname);
        let res: any = await this.uploadS3(createReadStream, dir + '/' + newName, mimetype);
        if (res.Location) {
          resolves(res.Location);
        } else {
          resolves(false);
        }
        resolves(res.Location);
      });
      stream.on('error', () => resolves(false));
    });
  }

  getProfilePicture(path: string, dir: string): string {

    let profilePicturePath: string = null;

    if (path) {

      // Local Upload 

      if (this.uploadMethod == 'local') {
        profilePicturePath = this.profilePictureBasePath + '/' + dir + '/' + path;

      } else if (this.uploadMethod == 'aws') {
        profilePicturePath = path;
      }

    }

    return profilePicturePath;

  }

  async checkFileSize(image, maxSize: number) {

    return await new Promise((resolves, rejects) => {
      let filesize = 0;
      const stream = new Readable();
      stream.push(image.buffer);
      stream.push(null); // End of stream

      stream.on('data', (chunk: Buffer) => {
        filesize += chunk.length;
        if (filesize > maxSize) {
          rejects(new HttpException(this.i18n.t('lib.FILE_LESS_THAN_5MB'), HttpStatus.BAD_REQUEST))

        }
      });
      stream.on('end', () =>
        resolves(filesize)
      );
      stream.on('error', rejects);
    });


  }

  async uploadS3(file, filename, mimetype) {
    const s3 = this.getS3();
    const params = {
      ACL: 'public-read',
      Bucket: this.AWS_S3_BUCKET,
      Key: String(filename),
      Body: file,
      ContentType: mimetype,
    };
    return new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if (err) {
          Logger.error(err);
          reject(err.message);
        }
        resolve(data);
      });
    });
  }

  async deleteS3(name) {
    const s3 = this.getS3();
    const params = {
      Bucket: this.AWS_S3_BUCKET,
      Key: String(name),
    };
    return new Promise((resolve, reject) => {
      s3.deleteObject(params, (err, data) => {
        if (err) {
          Logger.error(err);
          reject(err.message);
        }
        resolve(data);
      });
    });
  }

  getS3() {
    return new S3({
      accessKeyId: this.AWS_ACCESS_KEY_ID,
      secretAccessKey: this.AWS_SECRET_ACCESS_KEY,
    });
  }

}