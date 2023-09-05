import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ListSubjects{
  @Field()
  id:number
  @Field()
  subject:string
}

@ObjectType()
export class AdminListSubject {
  @Field(()=> [ListSubjects])
  subject  : ListSubjects[]

}
