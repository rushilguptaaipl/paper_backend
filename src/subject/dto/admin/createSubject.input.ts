import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateSubjectInput {
  @Field()
  @IsNotEmpty({ message: 'Please provide subject' })
  subject: string;

  @Field()
  @IsNotEmpty({message:"Please provide subject code"})
  subject_code : string;
}
