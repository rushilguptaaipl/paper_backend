import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AtGuard } from 'src/auth/guards/at.guard';
import RoleGuard from 'src/auth/guards/role.guard';
import { User } from '../database/user.entity';
import { AdminUserStatusInput } from '../dto/admin/admin-user-status.input';
import { ListUserInput } from '../dto/admin/list-user-admin.input';
import { AdminListTransaction } from '../entities/admin/admin-list-transaction.entity';
import { AdminProfile } from '../entities/admin/admin-profile.entity';
import { GetStatus } from '../entities/admin/get-status.entity';
import { UserAdmin } from '../entities/admin/list-user-entity';
import { BooleanMessage } from '../entities/boolean-message.entity';
import { CurrentUser } from '../user.decorator';
import { AdminService } from './admin.service';
import { AdminGetUserProfileInput } from '../dto/admin/admin-get-user-profile.input'
import { AdminVerifiesUserInput } from '../dto/admin/admin-verifies-user.input';
import PermissionGuard from 'src/auth/guards/permission.guard';
import { AdminUpdateUserInput } from '../dto/admin/admin-update-users.input';
import { AdminCreateUserInput } from '../dto/admin/admin-create-users.input';


@Resolver(() => User)
@UseGuards(PermissionGuard())
@UseGuards(AtGuard)
export class AdminResolver {
  constructor(private readonly adminService: AdminService
  ) { }

  @Mutation(() => BooleanMessage, { nullable: true, description: "Create a user" })
  adminCreateusers(@Args('adminCreateUserInput') adminCreateUserInput: AdminCreateUserInput) {
    return this.adminService.adminCreateUser(adminCreateUserInput);
  }

  @Query(() => [GetStatus], { name: 'adminGetStatus', nullable: true, description: "Get all status" })
  adminGetStatus(@CurrentUser() user) {
    return this.adminService.adminGetStatus(user);
  }


  @Query(() => AdminProfile, { nullable: true, description: "Get user profile based on user_id" })
  adminGetUserProfile(@Args('AdminGetUserProfileInput') adminGetUserProfileInput: AdminGetUserProfileInput, @CurrentUser() user) {
    return this.adminService.adminGetUserProfile(adminGetUserProfileInput, user);
  }



  @Query(() => UserAdmin, { nullable: true, description: "List all users" })
  adminListUser(@Args('listUserInput') listUserInput: ListUserInput, @CurrentUser() user) {
    return this.adminService.adminListUser(listUserInput, user);
  }


  @Mutation(() => BooleanMessage, { name: 'adminUserUpdateStatus', description: "Update user's status" })
  adminUserUpdateStatus(@Args('adminUserUpdateStatus') adminUserStatusInput: AdminUserStatusInput, @CurrentUser() user) {
    return this.adminService.adminUserUpdateStatus(adminUserStatusInput, user);
  }



  @Mutation(() => BooleanMessage, { description: "Delete a user" })
  adminDeleteUser(@Args('userId') userId: number) {
    return this.adminService.deleteUser(userId);
  }


  @Mutation(() => BooleanMessage, { description: "Verify a user" })
  adminVerifiesUser(@Args('adminVerifiesUserInput') adminVerifiesUserInput: AdminVerifiesUserInput) {
    return this.adminService.adminVerifiesUser(adminVerifiesUserInput)
  }

  @Mutation(() => BooleanMessage, { description: "Update a User" })
  adminUpdateusers(@Args('adminUpdateUserInput') adminUpdateUserInput: AdminUpdateUserInput) {
    return this.adminService.adminUpdateUser(adminUpdateUserInput);
  }

  @Mutation(() => BooleanMessage,{description:"Block a User (for Admin Only)"})
  adminBlockUser(@Args('userId',{type:() => Int}) userId: number){
    return this.adminService.adminBlockUser(userId);
  }

  @Mutation(() => BooleanMessage,{description:"Unblock a User (for Admin Only)"})
  adminUnblockUser(@Args('userId',{type:() => Int}) userId: number){
    return this.adminService.adminUnblockUser(userId);
  }


}
