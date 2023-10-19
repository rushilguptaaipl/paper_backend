import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateUniversityInput } from "../dto/admin/create-university.input";
import { InjectRepository } from "@nestjs/typeorm";
import { University } from "../database/university.entity";
import { Repository } from "typeorm";
import { BooleanMessage } from "src/user/entities/boolean-message.entity";
import { UpdateUniversityInput } from "../dto/admin/update-university.input";
import { GetUniversitiesResponse, UniversityResponse } from "../response/admin/getUniversities.response";
import { FindUniversityInput } from "../dto/admin/find-University.input";
import { FindCourseResponse } from "src/course/response/admin/findCourse.response";


@Injectable()
export class AdminuniversityService {
    constructor(@InjectRepository(University) private readonly universityRepository: Repository<University>) { }
    async adminCreateUniversity(createUniversityInput: CreateUniversityInput):Promise<BooleanMessage> {

        const isUniversityExists = await this.universityRepository.findOne({ where: { name: createUniversityInput.name, city: createUniversityInput.city } })

        if (isUniversityExists) {
            throw new ConflictException()
        }

        const result = await this.universityRepository.save(createUniversityInput);

        if (!result) {
            throw new BadRequestException();
        }

        const response = new BooleanMessage()
        response.success = true;
        response.message = " created";
        return response;

    }

    async adminUpdateUniversity(updateUniversityInput: UpdateUniversityInput):Promise<BooleanMessage> {
        const result = await this.universityRepository.update(updateUniversityInput.id, updateUniversityInput);
        if (!result) {
            throw new BadRequestException()
        }
        const response = new BooleanMessage()
        response.success = true;
        response.message = " updated";
        return response;
    }

    async adminListUniversities() :Promise<UniversityResponse> {
        const universities = await this.universityRepository.find()
        if (!universities.length) {
            throw new NotFoundException()
        }
        return UniversityResponse.decode(universities)
    }

    async adminfindUniversity(findUniversityInput:FindUniversityInput){
        const university = await this.universityRepository.findOne({where:{id:findUniversityInput.id}})
        if (!university) {
            throw new NotFoundException("University Not Found")
        }
        return FindCourseResponse.decode(university)
    }
}