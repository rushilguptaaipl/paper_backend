import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { getRequest } from 'src/common/graphql/context';
 
const PermissionGuard = (): Type<CanActivate> => {
  class PermissionGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      let isAuthorized = false;
      const request = getRequest(context);
      const userRoles = request.user.roles; // Get current user roles

      if(userRoles?.length){
        const SuperAdminRole = userRoles?.filter((role) => role.is_super_admin);
        if(SuperAdminRole?.length){
          return true; // Super admin have all permissions
        }
        const allRoles = userRoles
        .filter(role => Array.isArray(role.permissions)) // Filter roles with non-null and array-type permissions
        .reduce((permissions, role) => permissions.concat(role.permissions), []); // Combine permissions into a single array

        const gqlContext = GqlExecutionContext.create(context);
        const info = gqlContext.getInfo();
        const requestName = info.fieldName;

        if(allRoles.includes(requestName)){
          isAuthorized = true;
        }
      }
      return isAuthorized;
    }
  }
 
  return mixin(PermissionGuardMixin);
}
 
export default PermissionGuard;