import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Role {
    @Field({nullable : true})
    id: number;

    @Field({nullable : true})
    name: string;

    @Field()
    is_admin: boolean;

    @Field()
    is_super_admin: boolean;

    @Field(() => [String],{ nullable:true })
    permissions: string[];

    @Field({ nullable: true })
    created_at: Date;

}