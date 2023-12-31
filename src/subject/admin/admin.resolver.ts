import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateSubjectInput } from '../dto/admin/createSubject.input';
import { AdminSubjectService } from './admin-subject.service';
import { GetSubjectInput } from '../dto/admin/getSubjectinput';
import { AdminListSubject, ListSubjects } from '../entities/admin/admin-list-Subject.entity';
import { Subject } from '../database/subject.entity';
import { BooleanMessage } from 'src/user/entities/boolean-message.entity';
import {UpdateSubjectInput} from '../dto/admin/updateSubject.input'
import {DeleteSubjectInput} from '../dto/admin/deleteSubject.input'
import { AtGuard } from 'src/auth/guards/at.guard';
import { UseGuards } from '@nestjs/common';
import PermissionGuard from 'src/auth/guards/permission.guard';

@Resolver(() => Subject)
// @UseGuards(PermissionGuard())
// @UseGuards(AtGuard)
export class AdminSubjectResolver {
  constructor(private readonly adminSubjectService: AdminSubjectService) { }

  @Mutation(() => BooleanMessage)
  async adminCreateSubject(
    @Args('createSubjectInput') createSubjectInput: CreateSubjectInput,
  ) {
    return await this.adminSubjectService.adminCreateSubject(createSubjectInput);
  }

  @Query(() => AdminListSubject)
  async adminListSubject() {
    return await this.adminSubjectService.adminListSubject();
  }

  @Query(() => ListSubjects)
  async adminGetSubject(@Args('getSubjectInput') getSubjectInput: GetSubjectInput) {
    return await this.adminSubjectService.adminGetSubject(getSubjectInput)
  }

  @Mutation(()=>BooleanMessage)
  async adminUpdateSubject(@Args('updateSubjectInput') updateSubjectInput:UpdateSubjectInput){
    return this.adminSubjectService.adminUpdateSubject(updateSubjectInput)
  }

  @Mutation(()=>BooleanMessage)
  async adminDeleteSubject(@Args('DeleteSubjectInput') deleteSubjectInput:DeleteSubjectInput){
    return this.adminSubjectService.adminDeleteSubject(deleteSubjectInput)
  }
}