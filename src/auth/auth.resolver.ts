import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UserRegister } from '../user/entities/user-register.entity';
import { LoginInput } from '../user/dto/login.Input';
import { CreateUserInput } from '../user/dto/create-user.input';
import { UseGuards } from '@nestjs/common';
// import { CurrentUser } from 'src/user/user.decorator';
import { RefreshToken } from './entities/refresh-token.entity';
import { RtGuard } from './guards/rt.guard';
import { AtGuard } from './guards/at.guard';
import { CurrentUser, GetHeaders } from '../user/user.decorator';
import { GetCurrentUser } from './decorators/get-current-user.decorator';
import { logoutInput } from 'src/user/dto/logout.input';
import { LoginWithMobileOrEmailInput } from 'src/user/dto/login-with-mobileoremail.input';
import { BooleanMessage } from 'src/user/entities/boolean-message.entity';
import { LoginWithOtpInput } from 'src/user/dto/login-with-otp.input';


@Resolver(() => UserRegister)
export class AuthResolver {
  constructor(private readonly authService: AuthService) { }

  @Mutation(() => UserRegister, { name: "register", description: "Register" })
  register(@Args('registerInput') createUserInput: CreateUserInput, @GetHeaders() headers) {
    return this.authService.register(createUserInput);
  }

  @Mutation(() => UserRegister, { name: "login", description: "Login" })
  login(@Args('loginInput') loginInput: LoginInput, @GetHeaders() headers) {
    return this.authService.login(loginInput);
  }

  @Mutation(() => BooleanMessage, { name: "loginWithMobileOrEmail", description: "Login with mobile or email or Both" })
  loginWithMobileOrEmail(@Args('loginWithMobileOrEmailInput') loginWithMobileOrEmailInput: LoginWithMobileOrEmailInput) {
    return this.authService.loginWithMobileOrEmail(loginWithMobileOrEmailInput);
  }

  @Mutation(() => UserRegister, { name: "loginWithOtp", description: "Login with Otp" })
  loginWithOtp(@Args('loginWithOtpInput') loginWithOtpInput: LoginWithOtpInput) {
    return this.authService.loginWithOtp(loginWithOtpInput);
  }

  @UseGuards(AtGuard)
  @Mutation(() => Boolean, { name: "logout", description: "Logout" })
  logout(@CurrentUser() user, @Args('logoutInput') logoutInput: logoutInput) {
    return this.authService.logout(user, null, logoutInput);
  }

  @UseGuards(RtGuard)
  @Mutation(() => RefreshToken, { name: "refreshTokens", description: "Refresh Tokens" })
  refreshTokens(
    @CurrentUser() user,
    @GetCurrentUser('refreshToken') refreshToken: string
  ) {
    return this.authService.refreshToken(user, refreshToken);
  }
}
