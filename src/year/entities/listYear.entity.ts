import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class ListYear{
@Field()
id:number;
@Field()
year:number
}

@ObjectType()
export class AdminListYear{
    @Field(()=>[ListYear])
    year:ListYear[]
}