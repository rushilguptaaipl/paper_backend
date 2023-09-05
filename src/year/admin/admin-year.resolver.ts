import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Year } from "../database/year.entity";
import { AdminYearService } from "./admin-year.service";
import { CreateYearInput } from "../dto/createYear.input";
import { BooleanMessage } from "src/user/entities/boolean-message.entity";
import { AdminListYear, ListYear } from "../entities/listYear.entity";

import { GetYearInput } from "../dto/getYear.inpput";
import { RemoveYearInput } from '../dto/removeYear.input';


@Resolver(() => Year)
export class AdminYearResolver {
    constructor(private readonly yearService: AdminYearService) { }
    @Mutation(() => BooleanMessage)
    async adminCreateYear(@Args('createYearInput') createYearInput: CreateYearInput) {
        return this.yearService.adminCreateYear(createYearInput)
    }

    @Query(() => AdminListYear)
    async adminListYear() {
        return this.yearService.adminListYear()
    }

    @Query(() => ListYear)
    async adminGetYear(@Args('getYearInput') getYearInput: GetYearInput) {
        return this.yearService.adminGetYear(getYearInput)
    }

    @Mutation(() => BooleanMessage)
    async adminRemoveYear(@Args('removeYearImput') removeYearInput: RemoveYearInput) {
        return this.yearService.adminRemoveYear(removeYearInput)
    }
}