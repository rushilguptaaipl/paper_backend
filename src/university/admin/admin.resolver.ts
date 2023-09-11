import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { BooleanMessage } from "src/user/entities/boolean-message.entity";
import { CreateUniversityInput } from "../dto/admin/create-university.input";
import { AdminuniversityService } from "./admin.service";
import { UpdateUniversityInput } from "../dto/admin/update-university.input";
import { ListUniversitiesEntity, ListUniversityEntity } from "../entities/admin/listUniversity.entity";

@Resolver()
export class AdminuniversityResolver{
    constructor(private readonly universityService:AdminuniversityService){}
@Mutation(()=>BooleanMessage)
async adminCreateUniversity(@Args('createUniversityInput')createUniversityInput:CreateUniversityInput){
    return this.universityService.adminCreateUniversity(createUniversityInput);
}

@Mutation(()=>BooleanMessage)
async adminUpdateUniversity(@Args('updateUniversityInput')updateUniversityInput:UpdateUniversityInput){
    return await this.universityService.adminUpdateUniversity(updateUniversityInput);
}

@Query(()=>[ListUniversityEntity])
async adminListUniversities(){
    return await this.universityService.adminListUniversities();
}
}