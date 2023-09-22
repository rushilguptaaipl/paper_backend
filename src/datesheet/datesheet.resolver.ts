import { Args, Query, Resolver } from '@nestjs/graphql';
import { DatesheetService } from './datesheet.service';
import { GetDatesheetInput } from './dto/getDatesheet.input';
import { DatesheetEntity, GetDatesheetEntity } from './entities/getDatesheet.entity';

@Resolver()
export class DatesheetResolver {
    constructor(private readonly datesheetService: DatesheetService) { }

    @Query(() => [DatesheetEntity])
    async getDatesheet(@Args('getDatesheetInput') getDatesheetInput: GetDatesheetInput) {
        return await this.datesheetService.getDatesheet(getDatesheetInput)
        
    }
}
