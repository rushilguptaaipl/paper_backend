import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { BooleanMessage } from '../../user/entities/boolean-message.entity';
import { AdminService } from './admin.service';
import { UseGuards } from '@nestjs/common';
import { AtGuard } from 'src/auth/guards/at.guard';
import { Roles } from '../database/roles.entity';
import { CreateRoleInput } from '../dto/admin/create-role.input';
import { UpdateRoleInput } from '../dto/admin/update-role.input';
import { ListRoleInput } from '../dto/admin/list-role.input';
import { ListRole } from '../entities/admin/list-role.entity';
import { Role } from '../entities/admin/roles.entity';
import PermissionGuard from 'src/auth/guards/permission.guard';

@UseGuards(PermissionGuard())
@UseGuards(AtGuard)
@Resolver(() => Roles) 
export class AdminResolver {
  constructor(private readonly roleService: AdminService) { }

  @Mutation(() => BooleanMessage, { name: "adminCreateRole", description: "Create a Role" })
  adminCreateRole(@Args('createRoleInput') createRoleInput: CreateRoleInput) {
    return this.roleService.adminCreateRole(createRoleInput);
  }

  @Query(() => [ListRole], { name: 'adminListRoles', description: "List all roles" })
  adminListRoles(@Args('listRoleInput') listRoleInput: ListRoleInput) {
    return this.roleService.adminListRoles(listRoleInput);
  }

  @Query(() => Role, { name: 'adminGetRole', description: "Get single role by id" })
  async adminGetRole(@Args('id', { type: () => Int }) id: number) {
    return this.roleService.adminGetRoleById(id);
  }

  @Mutation(() => BooleanMessage, { name: "adminUpdateRole", description: "Update a Role" })
  adminUpdateRole(@Args('updateRoleInput') updateRoleInput: UpdateRoleInput) {
    return this.roleService.adminUpdateRole(updateRoleInput);
  }

  @Mutation(() => BooleanMessage, { name: "adminDeleteRole", description: "Delete a Role" })
  adminDeleteRole(@Args('id', { type: () => Int }) id: number) {
    return this.roleService.adminDeleteRole(id);
  }
}
