import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from './user.decorator';
import { SendOtpInput } from './dto/send-otp.input';
import { VerifyOtpInput } from './dto/verify-otp.input';
import { Profile } from './entities/profile.entity';
import { CheckEmailExistsInput } from './dto/check-email-exists.input';
import { ChangePasswordInput } from './dto/change-password.input';
import { ForgetPasswordInput } from './dto/forget-password.input';
import { EditProfileInput } from './dto/edit-profile.input';
import { BooleanMessage } from './entities/boolean-message.entity';
import { AtGuard } from 'src/auth/guards/at.guard';
import { BlockedUserInput } from './dto/block-user.input'
import { ImageUploadInput } from '../libs/dto/image-upload.input';
import { ImageUploadEntity } from '../libs/entities/image-upload.entity';
import PermissionGuard from 'src/auth/guards/permission.guard';
import { CheckUserInput } from './dto/check-user.input';
import { IsBlockInput } from './dto/is-block.input';


@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService
  ) { }

  @UseGuards(AtGuard)
  @UseGuards(PermissionGuard())
  @Query(() => Profile, { name: 'getProfile', description: "Get profile" })
  profile(@CurrentUser() user) {
    return this.userService.getProfile(user);
  }

  @UseGuards(AtGuard)
  @Mutation(() => BooleanMessage, { description: "Send a Otp" })
  sendOtp(@Args('sendOtp') sendOtpInput: SendOtpInput) {
    return this.userService.sendOtp(sendOtpInput);
  }

  @UseGuards(AtGuard)
  @Mutation(() => BooleanMessage, { description: "Verify a Otp" })
  verifyOtp(@Args('verifyOtp') verifyOtpInput: VerifyOtpInput) {
    return this.userService.verifyOtp(verifyOtpInput);
  }

  @UseGuards(AtGuard)
  @UseGuards(PermissionGuard())
  @Mutation(() => BooleanMessage, { description: "Check email exists" })
  checkEmailExists(@Args('checkEmailExists') checkEmailExistsInput: CheckEmailExistsInput) {
    return this.userService.checkEmailExists(checkEmailExistsInput);
  }

  @UseGuards(AtGuard)
  @Mutation(() => BooleanMessage, { name: "forgetPassword", description: "Forget password" })
  forgetPassword(@Args('forgetPassword') forgetPasswordInput: ForgetPasswordInput) {
    return this.userService.forgetPassword(forgetPasswordInput);
  }

  @UseGuards(AtGuard)
  @Mutation(() => ImageUploadEntity, { description: "Upload profile picture" })
  profilePictureUpload(@Args('profilePictureUpload') imageUploadInput: ImageUploadInput, @CurrentUser() user) {
    return this.userService.profilePictureUpload(imageUploadInput, user);
  }

  @UseGuards(AtGuard)
  @Mutation(() => BooleanMessage, { description: "Change a password" })
  changePassword(@Args('changePassword') changePasswordInput: ChangePasswordInput, @CurrentUser() user) {
    return this.userService.changePassword(changePasswordInput, user);
  }

  @UseGuards(AtGuard)
  @UseGuards(PermissionGuard())
  @Mutation(() => Profile, { name: 'editProfile', description: "Edit your profile" })
  editProfile(@Args('editProfile') editProfileInput: EditProfileInput, @CurrentUser() user) {
    return this.userService.editProfile(editProfileInput, user);
  }

  @UseGuards(AtGuard)
  @UseGuards(PermissionGuard())
  @Mutation(() => BooleanMessage, { description: "Block a user" })
  blockUser(@Args('blockedUserInput') blockedUserInput: BlockedUserInput, @CurrentUser() user) {
    return this.userService.blockUser(blockedUserInput, user);
  }

  @Query(() => BooleanMessage, { description: "Check a User" })
  checkUser(@Args('checkUserInput') checkUserInput: CheckUserInput) {
    return this.userService.checkUser(checkUserInput);
  }

  @Query(() => BooleanMessage, { description: "Check is user blocked" })
  isBlock(@Args('isBlockInput') isBlockInput: IsBlockInput) {
    return this.userService.isBlock(isBlockInput);
  }
}
