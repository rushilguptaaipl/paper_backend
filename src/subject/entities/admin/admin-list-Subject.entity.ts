import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ListSubjects{
  @Field({nullable:true})
  id:number
  @Field({nullable:true})
  subject:string
  @Field({nullable:true})
  subject_code:string
}

@ObjectType()
export class AdminListSubject {
  @Field(()=> [ListSubjects])
  subject  : ListSubjects[]

}
