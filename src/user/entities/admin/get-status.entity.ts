import { Field, ObjectType } from '@nestjs/graphql';
import { OverAllRating } from '../overAll-rating.entity';
import { UserRoles } from '../../../roles/entities/roles.entity';

@ObjectType()
export class GetStatus {

  @Field({ nullable: true })
  id: number;

  @Field({ nullable: true })
  name: string;
  
}
