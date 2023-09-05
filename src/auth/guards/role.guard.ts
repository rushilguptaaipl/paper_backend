//import {Roles} from './entities/roles.entity';
import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { getRequest } from 'src/common/graphql/context';
//import RequestWithUser from '../authentication/requestWithUser.interface';
 
const RoleGuard = (roleId: any): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
        let isAuthorized = false;
        const request = getRequest(context);
        const userRoles = request.user.roles;
        if(userRoles.length){
            for (let role of userRoles) {
                if(role.id == roleId){
                    isAuthorized =  true;
                }
              }

        }
    return isAuthorized;
    }
  }
 
  return mixin(RoleGuardMixin);
}
 
export default RoleGuard;