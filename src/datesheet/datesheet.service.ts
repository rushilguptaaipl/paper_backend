import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { GetDatesheetInput } from './dto/getDatesheet.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from 'src/course/database/admin/course.entity';
import { Year } from 'src/year/database/year.entity';
import { Repository } from 'typeorm';
import { Datesheet } from './database/datesheet.entity';
import { GetDatesheetEntity } from './entities/getDatesheet.entity';
import { GetDatesheetResponse } from './response/getDatesheet.response';
import * as exceljs from "exceljs"
import { Readable } from 'stream';
import { BooleanMessage } from 'src/user/entities/boolean-message.entity';
import { Subject } from 'src/subject/database/subject.entity';

@Injectable()
export class DatesheetService {
    constructor(@InjectRepository(Course) private readonly courseRepository: Repository<Course>,
        @InjectRepository(Year) private readonly yearRepository: Repository<Year>,
        @InjectRepository(Datesheet) private readonly datesheetRepository: Repository<Datesheet>,
        @InjectRepository(Subject) private readonly subjectRepository : Repository<Subject>
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

    async uploadDatesheet(file : Express.Multer.File){
    if (file == undefined) {
      throw new BadRequestException();
    } else if (file.filename.includes('xlsx')) {
        const workbook = new exceljs.Workbook();
        const stream = new Readable();
        stream.push(file.buffer);
        stream.push(null); 
        await workbook.xlsx.read(stream);
        const worksheet = workbook.getWorksheet(1);
        let docs = []
        worksheet.eachRow((row,rowNumber)=>{
            if (rowNumber !== 1 && rowNumber !== 2){
                const rowDate = {
                    subject:row.getCell(2).value,
                    year:row.getCell(3).value,
                    course:row.getCell(4).value,
                    date:row.getCell(5).value,
                    time:row.getCell(6).value,
                    type:row.getCell(7).value,
                    semester:row.getCell(8).value,
                    subject_code : row.getCell(9).value,
                    stream : row.getCell(10).value,
                    branch : row.getCell(11).value,
                }
                docs.push(rowDate)
            }
        });
        const arrToSave = []
        const datesheet =  new Datesheet()
        for(let i= 0;i<docs.length;i++){
            datesheet.date = docs[i].date
            datesheet.time = docs[i].time
            datesheet.type = docs[i].type 
            datesheet.semester = docs[i].semester 

            if(docs[i]?.year){
                const year = await this.yearRepository.findOne({where:{year:docs[i].year}});
                if(!year){
                    throw new NotFoundException(docs[i].year + "not found")
                }
                datesheet.year = year
            }
            if(docs[i]?.subject){
                const subject = await this.subjectRepository.findOne({where:{subject:docs[i].subject , subject_code:docs[i].subject_code}});
                if(!subject){
                    throw new NotFoundException(docs[i].subject + "not found")
                }
                datesheet.subject = subject;
            }
            if(docs[i]?.course){
                const course = await this.courseRepository.findOne({where:{stream:docs[i].stream  , branch : docs[i].branch}})
                if(!course){
                    throw new NotFoundException(docs[i].course + "not found")
                }
                datesheet.course = course;
            }
             arrToSave.push(datesheet)
        }
        await this.datesheetRepository.save(arrToSave);
        const response = new BooleanMessage()
        response.success = true
        response .message = "Datesheet created successfully"
    }
}
}
