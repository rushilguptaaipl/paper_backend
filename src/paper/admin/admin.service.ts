import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { UploadpaperInput } from '../dto/admin/uploadPaper.input';
import { InjectRepository } from "@nestjs/typeorm";
import { Subject } from "src/subject/database/subject.entity";
import { Repository } from 'typeorm';
import { Year } from "src/year/database/year.entity";
import { ImageUploadLib } from "src/libs/image-upload.lib";
import { BooleanMessage } from "src/user/entities/boolean-message.entity";
import { PaperUpload } from "../database/paperUpload.entity";

@Injectable()
export class AdminUploadPaperService {
    private PROFILE_PICTURE_UPLOAD_DIR: string = 'avatar';
    constructor(
        @InjectRepository(Subject) private readonly subjectRepository: Repository<Subject>,
        @InjectRepository(Year) private readonly yearRepository: Repository<Year>,
        @InjectRepository(PaperUpload) private readonly paperUploadRepository: Repository<PaperUpload>,
        private readonly imageUploadLib:ImageUploadLib
    ) { }
    async adminUploadPaper(uploadPaperInput: UploadpaperInput) {

        const isPaperExist = await this.paperUploadRepository
        .createQueryBuilder('paperUpload')
        .leftJoinAndSelect("paperUpload.subject",'subject')
        .leftJoinAndSelect("paperupload.year", "year")
        // .andWhere('subject= :name', { name: uploadPaperInput.subject })
        // .andWhere('year = :year', { year: uploadPaperInput.year })
        .getOne()

        if(isPaperExist){
            throw new ConflictException()
        }

        // const subject = await this.subjectRepository.findOne({ where: { subject: uploadPaperInput.subject } })

        // if (!subject) {
        //     throw new NotFoundException()
        // }

        // const year = await this.yearRepository.findOne({ where: { year: uploadPaperInput.year } })

        // if (!year) {
        //     throw new NotFoundException()
        // }

        const result = await this.imageUploadLib.imageUpload(uploadPaperInput.file,this.PROFILE_PICTURE_UPLOAD_DIR)

        const response = new BooleanMessage()
        response.success = true;
        response.message = "uploaded";
    }

}