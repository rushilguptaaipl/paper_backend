import { Injectable, NotFoundException } from '@nestjs/common';
import { GetDatesheetInput } from './dto/getDatesheet.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from 'src/course/database/admin/course.entity';
import { Year } from 'src/year/database/year.entity';
import { Repository } from 'typeorm';
import { NotFoundError } from 'rxjs';
import { Datesheet } from './database/datesheet.entity';
import { DatesheetEntity, GetDatesheetEntity } from './entities/getDatesheet.entity';
import { GetDatesheetResponse } from './response/getDatesheet.response';

@Injectable()
export class DatesheetService {
    constructor(@InjectRepository(Course) private readonly courseRepository: Repository<Course>,
        @InjectRepository(Year) private readonly yearRepository: Repository<Year>,
        @InjectRepository(Datesheet) private readonly datesheetRepository: Repository<Datesheet>
    ) { }
    async getDatesheet(getDatesheetInput: GetDatesheetInput):Promise<GetDatesheetEntity> {
        const course = await this.courseRepository.findOne({ where: { stream: getDatesheetInput.stream, branch: getDatesheetInput.branch } })
        if (!course) {
            throw new NotFoundException()
        }
        const year = await this.yearRepository.findOne({ where: { year: getDatesheetInput.year } });
        if (!year) {
            throw new NotFoundException()
        }

        const datesheet = await this.datesheetRepository.find({ where: { course: { id: course.id }, year: { id: year.id }, semester: getDatesheetInput.semester,type:getDatesheetInput.type } ,relations:{course:true,year:true,subject:true}})
        
        return GetDatesheetResponse.decode(datesheet)
    }
}
