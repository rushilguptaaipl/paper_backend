import { BadRequestException, createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { getRequest } from '../common/graphql/context';
import { User } from './database/user.entity';
import { AppDataSource } from '../../app-data-source';
import { GraphQLError } from 'graphql';
import { AuthenticationError } from 'apollo-server-express';

const userRepository = AppDataSource.getRepository(User);
import { errorEx } from 'error-ex';

export const  CurrentUser = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const request = getRequest(ctx);
    const user =  await userRepository.findOne({where : {id:request.user.userId } , relations:{ roles : true , status:true ,userAdditionalInformation : true, customerGroup: true}})
    
    if(!user){
      throw new BadRequestException('No user found');
    }
    if(!user.status || user.status.id !=1){
      throw new UnauthorizedException('Your account is deactivated');
    }    
    // return request.user;
    return user;
  },
);


export const  GetHeaders = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const request = getRequest(ctx); 
    return request.headers;
  },
);