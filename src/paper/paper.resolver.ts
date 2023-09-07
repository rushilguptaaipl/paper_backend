import { Args, Query, Resolver } from '@nestjs/graphql';
import { PaperService } from './paper.service';
import { GetPaperInput } from './dto/admin/getPaper.input';
import { GetPaper } from './entities/getPaper.entity';


@Resolver()
export class PaperResolver {
constructor(private readonly paperService:PaperService){}
    @Query(()=>GetPaper)
    getPaper(@Args('getPaperInput') getPaperInput:GetPaperInput){
        return this.paperService.getPaper(getPaperInput)
    }
    
}
