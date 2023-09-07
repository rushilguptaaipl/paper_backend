import { Injectable , HttpException , HttpStatus, ForbiddenException , BadRequestException , Logger} from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { createWriteStream ,existsSync , mkdirSync }  from 'fs';
import { join , extname} from 'path';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { v4 as uuid } from 'uuid';
import { Buffer } from 'buffer';
import { FileUpload } from "graphql-upload"
import { ImageUploadInput} from '../libs/dto/image-upload.input';
import { I18nService } from 'nestjs-i18n';
config();
@Injectable()
export class ImageUploadLib {

    private  imageMimeTypes = [
        'image/jpg',
         '*/pdf'
    ];

    private uploadMethod : string  ;
    private uploadDir : string;
    private uploadProfilePicturePath : string;
    private profilePictureBasePath  : string;
    private maxFileSize : number  = 5000000;

    private AWS_S3_BUCKET: string;
    private AWS_ACCESS_KEY_ID: string;
    private AWS_SECRET_ACCESS_KEY: string;

    constructor( 
      private readonly configService : ConfigService,
      private readonly i18n: I18nService
    )
    {
      this.uploadMethod = this.configService.get('UPLOAD_METHOD');
      this.uploadDir = 'public/'+this.configService.get('UPLOAD_DIR');
      this.uploadProfilePicturePath = join(process.cwd()+'/'+ this.uploadDir);
      this.profilePictureBasePath = this.configService.get('DOMAIN')+'/'+this.configService.get('UPLOAD_DIR');

      this.AWS_S3_BUCKET = this.configService.get('AWS_S3_BUCKET');
      this.AWS_ACCESS_KEY_ID = this.configService.get('AWS_ACCESS_KEY_ID');
      this.AWS_SECRET_ACCESS_KEY = this.configService.get('AWS_SECRET_ACCESS_KEY');

    }

    async imageUpload(imageUploadInput: any, dir : string){

        this.uploadProfilePicturePath = this.uploadProfilePicturePath +'/'+ dir+'/';

        if(this.uploadMethod == 'local'){
            return this.localUplaod(imageUploadInput);
        }else if(this.uploadMethod == 'aws'){
            return this.awsUpload(imageUploadInput, dir);
        }else{
          return new ForbiddenException(this.i18n.t('lib.VALID_UPLOAD_METHOD'));
        }
        
      }

     async localUplaod(imageUploadInput: any) : Promise<any>{

        const { createReadStream, filename , mimetype , encoding} = await imageUploadInput.image;
        
        const getMimeType = this.imageMimeTypes.includes(mimetype);
        await this.checkFileSize(createReadStream , this.maxFileSize);


        if(!getMimeType){
          throw new BadRequestException(`Unsupported file type ${extname(filename)}`)
        }

        const newName: string = uuid()+extname(filename);

        if(!existsSync(this.uploadProfilePicturePath)){
          mkdirSync(this.uploadProfilePicturePath , { recursive: true });
        }

    
        return new Promise(async (resolve, reject) => 
            createReadStream()
                .pipe(createWriteStream(this.uploadProfilePicturePath+newName))
                .on('finish', () => resolve(newName))       
                .on('error', () => resolve(false))
        );
     }

     async awsUpload(imageUpload: any, dir : string):Promise<any>{

      const { createReadStream, filename, mimetype  } = await imageUpload.image;

      const getMimeType = this.imageMimeTypes.includes(mimetype);
      if(!getMimeType){
        throw new BadRequestException(`Unsupported file type ${extname(filename)}`)
      }

      let filesize = 0;
      return await new Promise((resolves, rejects) => {
        let stream = createReadStream();
        stream.on('data', async (chunk: Buffer) => {
          filesize += chunk.length;
          if (filesize > this.maxFileSize) {
            rejects(new BadRequestException(this.i18n.t('lib.FILE_LESS_THAN_5MB')));
          }
        });
        stream.on('end', async () => { 
          const newName: string = uuid()+extname(filename);
          let res: any = await this.uploadS3(createReadStream(), dir+'/'+newName, mimetype);
          if(res.Location){
            resolves(res.Location);
          }else{
            resolves(false);
          }
          resolves(res.Location);
        });
        stream.on('error',  () => resolves(false));
      });
     }

     getProfilePicture(path : string , dir : string) : string{

        let profilePicturePath : string = null;

        if(path){

            // Local Upload 

            if(this.uploadMethod == 'local'){
                profilePicturePath =  this.profilePictureBasePath +'/'+dir+'/' + path;

            }else if(this.uploadMethod == 'aws'){
                profilePicturePath = path;
            }

        }

        return profilePicturePath;

     }

     async checkFileSize(createReadStream: FileUpload["createReadStream"], maxSize: number){

        return await new Promise((resolves, rejects) => {
            let filesize = 0;
            let stream = createReadStream();
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