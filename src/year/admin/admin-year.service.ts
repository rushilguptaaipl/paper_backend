import { ConflictException, Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Year } from '../database/year.entity';
import { Repository } from "typeorm";
import { CreateYearInput } from "../dto/createYear.input";
import { BooleanMessage } from 'src/user/entities/boolean-message.entity';
import { ListYearResponse } from '../response/listYear.response';
import { GetYearInput } from '../dto/getYear.inpput';
import { AdminListYear } from '../entities/listYear.entity';
import { RemoveYearInput } from '../dto/removeYear.input';

@Injectable()
export class AdminYearService {
    constructor(@InjectRepository(Year) private readonly yearRepository: Repository<Year>) { }
    async adminCreateYear(createYearInput: CreateYearInput): Promise<BooleanMessage> {
        const isYearExist: Year = await this.yearRepository.findOne({ where: { year: createYearInput.year } })
        if (isYearExist) {
            throw new ConflictException()
        }
        const result: Year = await this.yearRepository.save(createYearInput)
        if (!result) {
            throw new BadRequestException()
        }
        const response = new BooleanMessage()
        response.success = true;
        response.message = "created";
        return response;
    }

    async adminListYear(): Promise<ListYearResponse> {
        const years: Year[] = await this.yearRepository.find()
        if (!years.length) {
            throw new NotFoundException()
        }

        const result = { year: years }
        return ListYearResponse.decode(result);
    }

    async adminGetYear(getYearInput: GetYearInput): Promise<Year> {
        const year: Year = await this.yearRepository.findOne({ where: { id: getYearInput.id } })
        if (!year) {
            throw new NotFoundException()
        }

        return year;
    }

    async adminRemoveYear(removeYearInput: RemoveYearInput): Promise<BooleanMessage> {
        const year: Year = await this.yearRepository.findOne({ where: { id: removeYearInput.id } })
        if (!year) {
            throw new NotFoundException()
        }
        const result = await this.yearRepository.softDelete(removeYearInput.id)

        if (result.affected == 0) {
            throw new BadRequestException()
        }
        const respose = new BooleanMessage()
        respose.success = true;
        respose.message = "deleted"
        return respose
    }
}