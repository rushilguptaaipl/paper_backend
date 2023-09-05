import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class UserRoles {
    @Field({nullable : true})
    id: number;

    @Field({nullable : true})
    name: string;

    @Field(() => [String],{ nullable:true })
    permissions: string[];
}
