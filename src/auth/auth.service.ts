import {
  ForbiddenException,
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserInput } from '../user/dto/create-user.input';
import { UserRegister } from '../user/entities/user-register.entity';
import { JwtService } from '@nestjs/jwt';
import { LoginInput } from '../user/dto/login.Input';
import { RefreshToken } from './entities/refresh-token.entity';
import { JwtPayload } from './types/jwtPayload.type';
import { Tokens } from './types/tokens.type';
import { ConfigService } from '@nestjs/config';
import { AuthResponse } from 'src/user/response/user.response';
import { I18nService } from 'nestjs-i18n';
import { ImageUploadLib } from '../libs/image-upload.lib';
import { UserRepository } from '../user/repositories/user.repository';
import { User } from 'src/user/database/user.entity';
import { DeviceDetails } from 'src/user/database/device-details.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { logoutInput } from 'src/user/dto/logout.input';
import { Otp } from 'src/user/database/otp.entity';
import { LoginWithOtpInput } from 'src/user/dto/login-with-otp.input';
import { BooleanMessage } from 'src/user/entities/boolean-message.entity';
import { SMSService } from 'src/user/sms.service';
import { MailService } from 'src/user/mail.service';
import { LoginWithMobileOrEmailInput } from 'src/user/dto/login-with-mobileoremail.input';
import { SendOtpOn } from 'src/user/enum/send-otp-on.enum';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Otp)
    private otpRepository: Repository<Otp>,
    @InjectRepository(DeviceDetails)
    private deviceDetail: Repository<DeviceDetails>,
    private jwtService: JwtService,
    private mailService: MailService,
    private imageUploadLib: ImageUploadLib,
    private config: ConfigService,
    private readonly i18n: I18nService,
    private _userRepository: UserRepository,
    private smsService: SMSService,
  ) { }

  async validateUser(
    username: string,
    pass: string,
    role: number,
  ): Promise<any> {
    const user = await this._userRepository.doLogin(username, pass, role);
    // if (user && user.password === pass) {
    //   const { password, ...result } = user;
    //   return result;
    // }
    return null;
  }

  /**
   * user login
   * @param loginInput
   * @returns user detail
   */
  async login(loginInput: LoginInput): Promise<UserRegister> {
    const username = loginInput.username.toLowerCase();
    const user = await this._userRepository.doLogin(
      username,
      loginInput.password,
      loginInput.role,
    );

    if (user) {

      
      
      const tokens = await this.getTokens(user.id, user.email, user.roles);
      await this._userRepository.updateRtHash(user.id, tokens.refresh_token);
      return AuthResponse.decode(user, tokens);
    } else {
      throw new BadRequestException(
        this.i18n.t('auth.INVALID_EMAIL_OR_PASSWORD'),
      );
    }
  }

  /**
   *
   * @param loginWithMobileInput
   * @returns
   */
  async loginWithMobileOrEmail(
    loginWithMobileOrEmailInput: LoginWithMobileOrEmailInput,
  ): Promise<BooleanMessage> {
    let getUser: User;
    const otp = Math.floor(1000 + Math.random() * 9000);
    const otpData = new Otp();
    otpData.otp = otp;
    const expirationDate = new Date(Date.now());
    expirationDate.setMinutes(expirationDate.getMinutes() + 5);
    otpData.expired_at = expirationDate;

    if (loginWithMobileOrEmailInput.login_type === SendOtpOn.PHONE) {
      if (loginWithMobileOrEmailInput.mobile && loginWithMobileOrEmailInput.country_code) {
        getUser = await this.userService.findOneByPhone(
          loginWithMobileOrEmailInput.country_code,
          loginWithMobileOrEmailInput.mobile,
        );
        if (getUser.is_block) {
          throw new BadRequestException(this.i18n.t('user.USER_BLOCKED'));
        }

        if (!getUser) {
          throw new NotFoundException(
            this.i18n.t('auth.NO_USER_FOUND_WITH_MOBILE'),
          );
        }

        otpData.country_code = loginWithMobileOrEmailInput.country_code;
        otpData.mobile = loginWithMobileOrEmailInput.mobile;
        otpData.save();

        const phone = loginWithMobileOrEmailInput.country_code.concat(
          loginWithMobileOrEmailInput.mobile,
        );
        //Send OTP to mobile
        await this.smsService.mobileConfirmation(phone, otp);
      } else { throw new BadRequestException(this.i18n.t('auth.COUNTRY_CODE_MOBILE_REQUIRED')); };
    };


    if (loginWithMobileOrEmailInput.login_type === SendOtpOn.EMAIL) {
      if (loginWithMobileOrEmailInput.email) {
        getUser = await this.userService.findOneByEmail(
          loginWithMobileOrEmailInput.email,
        );
        if (!getUser) {
          throw new NotFoundException(
            this.i18n.t('auth.NO_USER_FOUND_WITH_EMAIL'),
          );
        }

        if (getUser.is_block) {
          throw new BadRequestException(this.i18n.t('user.USER_BLOCKED'));
        }
        otpData.email = loginWithMobileOrEmailInput.email;
        otpData.save();

        //Send OTP to Email
        await this.mailService.sendUserConfirmation(
          loginWithMobileOrEmailInput.email,
          otp,
        );
      } else {
        throw new BadRequestException(this.i18n.t('auth.EMAIL_REQUIRED'));
      }
    };


    if (loginWithMobileOrEmailInput.login_type === SendOtpOn.EMAILANDPHONE) {
      if (loginWithMobileOrEmailInput.email && loginWithMobileOrEmailInput.mobile && loginWithMobileOrEmailInput.country_code) {
        getUser = await this.userService.findOneByPhoneandEmail(
          loginWithMobileOrEmailInput.country_code,
          loginWithMobileOrEmailInput.mobile,
          loginWithMobileOrEmailInput.email,
        );

        if (!getUser) {
          throw new NotFoundException(
            this.i18n.t('auth.NO_USER_FOUND_WITH_MOBILE_EMAIL'),
          );
        }

        if (getUser.is_block) {
          throw new BadRequestException(this.i18n.t('user.USER_BLOCKED'));
        }
        otpData.email = loginWithMobileOrEmailInput.email;
        otpData.country_code = loginWithMobileOrEmailInput.country_code;
        otpData.mobile = loginWithMobileOrEmailInput.mobile;
        otpData.save();

        const phone = loginWithMobileOrEmailInput.country_code.concat(
          loginWithMobileOrEmailInput.mobile,
        );
        //Send OTP to mobile
        await this.smsService.mobileConfirmation(phone, otp);

        //Send OTP to Email
        await this.mailService.sendUserConfirmation(
          loginWithMobileOrEmailInput.email,
          otp,
        );
      } else {
        throw new BadRequestException(this.i18n.t('auth.EMAIL_COUNTRY_CODE_MOBILE_REQUIRED'))
      }
    };

    const res = new BooleanMessage();
    res.success = true;
    res.message = this.i18n.t('auth.OTP_SENT_SECCESSFULL');
    return res;
  }

  /**
   *
   * @param loginWithOtpInput
   * @returns
   */
  async loginWithOtp(
    loginWithOtpInput: LoginWithOtpInput,
  ): Promise<UserRegister> {
    let getOtp: Otp;
    let user: User;

    if (loginWithOtpInput.login_type === SendOtpOn.PHONE) {
      if (loginWithOtpInput.mobile && loginWithOtpInput.country_code) {
        getOtp = await this.otpRepository.findOne({
          where: {
            country_code: loginWithOtpInput.country_code,
            mobile: loginWithOtpInput.mobile,
          },
          order: { created_at: 'DESC' },
        });

        user = await this.userRepository.findOne({
          where: {
            mobile: loginWithOtpInput.mobile,
           
          },
          relations: { roles: true},
        });
      } else { throw new BadRequestException(this.i18n.t('auth.COUNTRY_CODE_MOBILE_REQUIRED')); }
    };


    if (loginWithOtpInput.login_type === SendOtpOn.EMAIL) {
      if (loginWithOtpInput.email) {
        getOtp = await this.otpRepository.findOne({
          where: { email: loginWithOtpInput.email },
          order: { created_at: 'DESC' },
        });

        user = await this.userRepository.findOne({
          where: { email: loginWithOtpInput.email },
          relations: { roles: true},
        });
      } else {
        throw new BadRequestException(this.i18n.t('auth.EMAIL_REQUIRED'));
      }
    };

    if (loginWithOtpInput.login_type === SendOtpOn.EMAILANDPHONE) {
      if (loginWithOtpInput.email && loginWithOtpInput.mobile && loginWithOtpInput.country_code) {
        getOtp = await this.otpRepository.findOne({
          where: {
            email: loginWithOtpInput.email,
            country_code: loginWithOtpInput.country_code,
            mobile: loginWithOtpInput.mobile,
          },
          order: { created_at: 'DESC' },
        });

        user = await this.userRepository.findOne({
          where: {
            email: loginWithOtpInput.email,
            mobile: loginWithOtpInput.mobile,
          },
          relations: { roles: true},
        });
      } else {
        throw new BadRequestException(this.i18n.t('auth.EMAIL_COUNTRY_CODE_MOBILE_REQUIRED'))
      }
    };

    if (user.is_block) {
      throw new BadRequestException(this.i18n.t('user.USER_BLOCKED'));
    }

    if (!getOtp) {
      throw new BadRequestException(this.i18n.t('auth.NO_OTP_GENERATED'));
    }

    if (!(getOtp.expired_at > new Date(Date.now()))) {
      throw new BadRequestException(this.i18n.t('auth.OTP_EXPIRED'));
    }

    if (getOtp.is_verified == true) {
      throw new BadRequestException(this.i18n.t('auth.OTP_ALREADY_USED'));
    }

    if (getOtp.otp == loginWithOtpInput.OTP) {
      getOtp.is_verified = true;
      await this.otpRepository.save(getOtp);
      const deviceDetail = await this.deviceDetail.findOne({
        where: {
          device_id: loginWithOtpInput.device_id,
          device_token: loginWithOtpInput.device_token,
          user: { id: user.id },
        },
      });

      if (!deviceDetail) {
        await this.devicedetail(loginWithOtpInput, user);
      }
      user.profile_picture = this.imageUploadLib.getProfilePicture(
        user.profile_picture,
        'avatar',
      );
      const tokens = await this.getTokens(user.id, user.email, user.roles);
      await this._userRepository.updateRtHash(user.id, tokens.refresh_token);

      return AuthResponse.decode(user, tokens);
    } else {
      throw new BadRequestException(this.i18n.t('auth.INCORRECT_OTP'));
    }
  }

  /**
   *
   * @param createUserInput
   * @returns
   */
  async register(createUserInput: CreateUserInput): Promise<UserRegister> {
    const user = await this._userRepository.createUser(createUserInput);

    if (user) {
      const tokens = await this.getTokens(user.id, user.email, user.roles);
      await this._userRepository.updateRtHash(user.id, tokens.refresh_token);
      return AuthResponse.decode(user, tokens);
    } else {
      throw new BadRequestException(this.i18n.t('auth.SOMETHING_BAD'));
    }
  }

  /**
   *
   * @param user
   * @param rt
   * @param logoutInput
   * @returns
   */
  async logout(
    user: User,
    rt: null,
    logoutInput: logoutInput,
  ): Promise<Boolean> {
    await this._userRepository.updateRtHash(user.id, rt);
    return true;
  }

  /**
   *
   * @param user
   * @param rt
   * @returns
   */
  async refreshToken(user: User, rt: string): Promise<RefreshToken> {
    const getUser = await this._userRepository.getUserById(user.id);
    if (getUser.is_block) {
      throw new BadRequestException(this.i18n.t('user.USER_BLOCKED'));
    }

    if (!getUser || !getUser.hashRt) {
      throw new ForbiddenException(this.i18n.t('auth.ACCESS_DENIED'));
    }
    if (rt != getUser.hashRt) {
      throw new ForbiddenException(this.i18n.t('auth.ACCESS_DENIED'));
    }

    const tokens = await this.getTokens(user.id, getUser.email, getUser.roles);
    await this._userRepository.updateRtHash(getUser.id, tokens.refresh_token);
    const res = new RefreshToken();
    res.access_token = tokens.access_token;
    res.refresh_token = tokens.refresh_token;
    return res;
  }

  /**
   *
   * @param userId
   * @param email
   * @param useRoles
   * @returns
   */
  async getTokens(
    userId: number,
    email: string,
    useRoles: any,
  ): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      userId: userId,
      email: email,
      roles: useRoles,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>('SECRET_ACCESS_JWT'),
        expiresIn: this.config.get<string>('TOKEN_EXPIRES_IN'),
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>('SECRET_REFRESH_JWT'),
        expiresIn: '7d',
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  /**
   *
   * @param createUserInput
   * @param user
   */
  async devicedetail(createUserInput: any, user) {
    const device = new DeviceDetails();
    device.device_id = createUserInput.device_id;
    device.device_token = createUserInput.device_token;
    device.platform = createUserInput.platform;
    device.user = user;
    await this.deviceDetail.save(device);
  }
}
