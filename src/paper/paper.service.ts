import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaperUpload } from './database/paperUpload.entity';
import { Repository } from 'typeorm';
import { Year } from 'src/year/database/year.entity';
import { Subject } from 'src/subject/database/subject.entity';
import { GetPaperInput } from './dto/admin/getPaper.input';
import { GetPaperResponse } from './response/getPaper.response';


@Injectable()
export class PaperService {

    constructor(@InjectRepository(PaperUpload) private readonly paperUploadRepository: Repository<PaperUpload>,
        @InjectRepository(Year) private readonly yearRepository: Repository<Year>,
        @InjectRepository(Subject) private readonly subjectRepository: Repository<Subject>) { }

    async getPaper(getPaperInput: GetPaperInput) {
        const paper = await this.paperUploadRepository
            .createQueryBuilder('paperUpload')
            .leftJoinAndSelect('paperUpload.subject', 'subject')
            .leftJoinAndSelect('paperUpload.year', 'year')
            .leftJoinAndSelect('paperUpload.university','university')
            .andWhere('subject= :name', { name: getPaperInput.subject })
            .andWhere('year = :year', { year: getPaperInput.year })
            .andWhere('name = :university' , {university : getPaperInput.university})
            .getOne()
            console.log(paper);
            return GetPaperResponse.decode(paper)
            
    }
}
