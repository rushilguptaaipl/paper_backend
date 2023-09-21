import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { CreateSubjectInput } from '../dto/admin/createSubject.input';
import {updateSubjectInput} from '../dto/admin/updateSubject.input'
import {DeleteSubjectInput} from '../dto/admin/deleteSubject.input'
import { GetSubjectInput } from '../dto/admin/getSubjectinput';
import { Subject } from '../database/subject.entity';
import { BooleanMessage } from 'src/user/entities/boolean-message.entity';
import { ListSubjectResponse } from '../response/admin/list-subject.response';

@Injectable()
export class AdminSubjectService {
  constructor(
    @InjectRepository(Subject) private readonly subjectRepository: Repository<Subject>,
    private readonly i18n: I18nService,
  ) {}

  async adminCreateSubject(createSubjectInput: CreateSubjectInput): Promise<BooleanMessage>{

    const IsSubjectExist = await this.subjectRepository.findOne({where:{subject_code:createSubjectInput.subject_code}})
    if(IsSubjectExist)
    {
      throw new ConflictException()
    }

    const result = await this.subjectRepository.save(createSubjectInput);
    if (!result) {
      throw new BadRequestException('Something went wrong!');
    }

    const response = new BooleanMessage();
    response.success = true;
    response.message = "created";
    return response
  }

  async adminListSubject() : Promise<ListSubjectResponse>{
    const subject = await this.subjectRepository.find()
    if(!subject.length)
    {
        throw new NotFoundException()
    }
    const result = {subject : subject}
    return ListSubjectResponse.decode(result);
  } 

  async adminGetSubject(getSubjectInput : GetSubjectInput):Promise<Subject>{
    const subject : Subject = await this.subjectRepository.findOne({where:{id:getSubjectInput.id}});
     if(!subject)
     {
      throw new NotFoundException()
     }

    return subject
  }

  async adminUpdateSubject(updateSubjectInput:updateSubjectInput):Promise<BooleanMessage>{
    const subject : Subject =  await this.subjectRepository.findOne({where:{id:updateSubjectInput.id}})
    if(!subject)
    {
      throw new NotFoundException()
    }

    const result = await this.subjectRepository.update(updateSubjectInput.id,updateSubjectInput)
    if(!result)
    {
      throw new BadRequestException('Something went wrong!');
    }
    const response = new BooleanMessage()
    response.success = true;
    response.message = "updated"
    return response
  }

  async adminDeleteSubject(deleteSubjectInput:DeleteSubjectInput):Promise<BooleanMessage>{
    const subject = await this.subjectRepository.findOne({where:{id:deleteSubjectInput.id}})
    if(!subject)
    {
      throw new NotFoundException()
    }
    const result = await this.subjectRepository.softDelete(deleteSubjectInput.id)
    if(result.affected == 0)
    {
      throw new BadRequestException('Something went wrong!');
    }
    const response = new BooleanMessage()
    response.success = true;
    response.message = "deleted"
    return response

  }
}