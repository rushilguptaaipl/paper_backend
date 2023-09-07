import {
  Injectable,
  HttpException,
  HttpStatus,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './database/user.entity';
import { Roles } from '../roles/database/roles.entity';
import { Status } from './database/status.entity';
import { SendOtpInput } from './dto/send-otp.input';
import { BooleanMessage } from './entities/boolean-message.entity';
import * as otpGenerator from 'otp-generator';
import { VerifyOtpInput } from './dto/verify-otp.input';
import { Otp } from './database/otp.entity';
import { MailService } from './mail.service';
import { Profile } from './entities/profile.entity';
import { CheckEmailExistsInput } from './dto/check-email-exists.input';
import { ChangePasswordInput } from './dto/change-password.input';
import { ForgetPasswordInput } from './dto/forget-password.input';
import { EditProfileInput } from './dto/edit-profile.input';
import { GetProfileResponse } from './response/user.response';
import { UserAdditionalInformation } from './database/user-additional.entity';
import { I18nService } from 'nestjs-i18n';

// Upload image Lib
import { ImageUploadInput } from '../libs/dto/image-upload.input';
import { ImageUploadEntity } from '../libs/entities/image-upload.entity';
import { ImageUploadLib } from '../libs/image-upload.lib';
import { RestImageUploadLib } from 'src/libs/rest-image-upload.lib';
import { UserRepository } from './repositories/user.repository';
import { BlockedUserInput } from './dto/block-user.input';
import { BlockedUser } from './database/blocked-user.entity';
import { SMSService } from './sms.service';
import { CheckUserInput } from './dto/check-user.input';
import { CheckUserBy } from './enum/checkUserBy.enum';
import { IsBlockInput } from './dto/is-block.input';
import { SendOtpOn } from './enum/send-otp-on.enum';

@Injectable()
export class UserService {
  private PROFILE_PICTURE_UPLOAD_DIR: string = 'avatar';
  private DEACTIVE: number = 2;
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserAdditionalInformation)
    private userAdditionalRepository: Repository<UserAdditionalInformation>,
    @InjectRepository(Roles)
    private rolesRepository: Repository<Roles>,
    @InjectRepository(Status)
    private statusRepository: Repository<Status>,
    @InjectRepository(Otp)
    private otpRepository: Repository<Otp>,
    @InjectRepository(BlockedUser)
    private blockedUserRepository: Repository<BlockedUser>,
    private mailService: MailService,
    private readonly i18n: I18nService,
    private imageUploadLib: ImageUploadLib,
    private restImageUploadLib: RestImageUploadLib,
    private _userRepository: UserRepository,
    private smsService: SMSService,
  ) { }

  /**
   *
   * @param user
   * @returns
   */
  async getProfile(user: User): Promise<Profile> {
    if (user) {
      user.profile_picture = this.imageUploadLib.getProfilePicture(
        user.profile_picture,
        this.PROFILE_PICTURE_UPLOAD_DIR,
      );

      if (user.is_block) {
        throw new BadRequestException(this.i18n.t('user.USER_BLOCKED'));
      }

      return GetProfileResponse.decode(user);
    } else {
      throw new HttpException(
        this.i18n.t('user.USER_NOT_FOUND'),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   *
   * @param sendOtpInput
   * @returns
   */

  async sendOtp(sendOtpInput: SendOtpInput): Promise<BooleanMessage> {
    //const emailOtp = otpGenerator.generate(4, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets:false });
    const generateOtp = Math.floor(1000 + Math.random() * 9000);
    const otpData = new Otp();
    otpData.otp = generateOtp;
    const expirationDate = new Date(Date.now());
    expirationDate.setMinutes(expirationDate.getMinutes() + 5);
    otpData.expired_at = expirationDate;

    if (sendOtpInput.sendOtp_on === SendOtpOn.EMAIL && sendOtpInput.email) {
      otpData.email = sendOtpInput.email.toLowerCase();
      otpData.save();
      //send OTP to Email
      await this.mailService.sendUserConfirmation(
        sendOtpInput.email,
        generateOtp,
      );
    } else if (
      sendOtpInput.sendOtp_on === SendOtpOn.PHONE &&
      sendOtpInput.country_code &&
      sendOtpInput.mobile
    ) {
      otpData.country_code = sendOtpInput.country_code;
      otpData.mobile = sendOtpInput.mobile;
      otpData.save();

      const phone = sendOtpInput.country_code.concat(sendOtpInput.mobile);
      //Send OTP to mobile
      await this.smsService.mobileConfirmation(phone, generateOtp);
    } else if (
      sendOtpInput.sendOtp_on === SendOtpOn.EMAILANDPHONE &&
      sendOtpInput.country_code &&
      sendOtpInput.mobile &&
      sendOtpInput.email
    ) {
      otpData.country_code = sendOtpInput.country_code;
      otpData.mobile = sendOtpInput.mobile;
      otpData.email = sendOtpInput.email.toLowerCase();
      otpData.save();

      const phone = sendOtpInput.country_code.concat(sendOtpInput.mobile);
      //Send OTP to mobile
      await this.smsService.mobileConfirmation(phone, generateOtp);

      //Send OTP to email
      await this.mailService.sendUserConfirmation(
        sendOtpInput.email,
        generateOtp,
      );
    }

    const res = new BooleanMessage();
    res.success = true;
    res.message = this.i18n.t('user.OTP_SENT_SECCESSFULL');
    return res;
  }

  /**
   *
   * @param verifyOtpInput
   * @returns
   */

  async verifyOtp(verifyOtpInput: VerifyOtpInput): Promise<BooleanMessage> {
    let otp: Otp;

    if (verifyOtpInput.sendOtp_on === SendOtpOn.EMAIL && verifyOtpInput.email) {
      otp = await this.otpRepository.findOne({
        where: { email: verifyOtpInput.email.toLowerCase() },
        order: { created_at: 'DESC' },
      });
    } else if (
      verifyOtpInput.sendOtp_on === SendOtpOn.PHONE &&
      verifyOtpInput.country_code &&
      verifyOtpInput.mobile
    ) {
      otp = await this.otpRepository.findOne({
        where: {
          country_code: verifyOtpInput.country_code,
          mobile: verifyOtpInput.mobile,
        },
        order: { created_at: 'DESC' },
      });
    } else if (
      verifyOtpInput.sendOtp_on === SendOtpOn.EMAILANDPHONE &&
      verifyOtpInput.country_code &&
      verifyOtpInput.mobile &&
      verifyOtpInput.email
    ) {
      otp = await this.otpRepository.findOne({
        where: {
          email: verifyOtpInput.email.toLowerCase(),
          country_code: verifyOtpInput.country_code,
          mobile: verifyOtpInput.mobile,
        },
        order: { created_at: 'DESC' },
      });
    }

    const res = new BooleanMessage();
    if (!otp) {
      res.success = false;
      res.message = this.i18n.t('user.NO_OTP_GENERATED');
    }

    if (!(otp.expired_at > new Date(Date.now()))) {
      throw new BadRequestException(this.i18n.t('user.OTP_EXPIRED'));
    }

    if (otp.is_verified == true) {
      res.success = false;
      res.message = this.i18n.t('user.OTP_ALREADY_USED');
    }

    if (!(otp.otp == verifyOtpInput.code)) {
      res.success = false;
      res.message = this.i18n.t('user.INCORRECT_OTP');
    }

    otp.is_verified = true;
    this.otpRepository.save(otp);
    res.success = true;
    res.message = this.i18n.t('user.OTP_CORRECT');
    return res;
  }

  /**
   *
   * @param filter
   * @returns
   */

  async findOneByEmail(email: string): Promise<User> {
    const result = await this.userRepository.findOne({
      where: { email: email.toLowerCase() },
    });

    return result;
  }

  /**
   *
   * @param checkEmailExists
   * @returns
   */

  async checkEmailExists(
    checkEmailExists: CheckEmailExistsInput,
  ): Promise<BooleanMessage> {
    const emailExist = await this.findOneByEmail(checkEmailExists.email);

    const res = new BooleanMessage();
    if (emailExist) {
      res.success = true;
      res.message = this.i18n.t('user.EMAIL_ALREADY_REGISTERED');
    } else {
      res.success = false;
      res.message = this.i18n.t('user.EMAIL_AVAILABLE');
    }
    return res;
  }

  /**
   *
   * @param forgetPasswordInput
   * @returns
   */

  async forgetPassword(
    forgetPasswordInput: ForgetPasswordInput,
  ): Promise<BooleanMessage> {
    let getUser: User;

    if (
      forgetPasswordInput.findUserBy === SendOtpOn.EMAIL &&
      forgetPasswordInput.email
    ) {
      getUser = await this.findOneByEmail(forgetPasswordInput.email);
    } else if (
      forgetPasswordInput.findUserBy === SendOtpOn.PHONE &&
      forgetPasswordInput.country_code &&
      forgetPasswordInput.mobile
    ) {
      getUser = await this.findOneByPhone(
        forgetPasswordInput.country_code,
        forgetPasswordInput.mobile,
      );
    } else if (
      forgetPasswordInput.findUserBy === SendOtpOn.EMAILANDPHONE &&
      forgetPasswordInput.country_code &&
      forgetPasswordInput.mobile &&
      forgetPasswordInput.email
    ) {
      getUser = await this.findOneByPhoneandEmail(
        forgetPasswordInput.country_code,
        forgetPasswordInput.mobile,
        forgetPasswordInput.email,
      );
    }

    if (getUser.is_block) {
      throw new BadRequestException(this.i18n.t('user.USER_BLOCKED'));
    }

    // new and old password should not be same
    const isMatchOldPassword = await bcrypt.compare(
      forgetPasswordInput.password,
      getUser.password,
    );
    if (isMatchOldPassword) {
      throw new BadRequestException(
        this.i18n.t('user.NEW_AND_OLD_PASSWORD_NOT_SAME'),
      );
    }
    const saltOrRounds = 10;
    const salt = await bcrypt.genSalt(saltOrRounds);
    const passwordHash = await bcrypt.hash(forgetPasswordInput.password, salt);

    const res = new BooleanMessage();
    if (getUser) {
      getUser.password = passwordHash;
      this.userRepository.save(getUser);

      res.success = true;
      res.message = this.i18n.t('user.PASSWORD_CHANGED');
    } else {
      res.success = false;
      res.message = this.i18n.t('user.USER_NOT_FOUND');
    }
    return res;
  }

  /**
   *
   * @param changePasswordInput
   * @param user
   * @returns
   */

  async changePassword(
    changePasswordInput: ChangePasswordInput,
    user: User,
  ): Promise<BooleanMessage> {
    if (user) {
      if (user.is_block) {
        throw new BadRequestException(this.i18n.t('user.USER_BLOCKED'));
      }

      const isMatch = await bcrypt.compare(
        changePasswordInput.oldPassword,
        user.password,
      );
      const res = new BooleanMessage();

      if (isMatch) {
        // new and old password should not be same
        const isMatchOldPassword = await bcrypt.compare(
          changePasswordInput.newPassword,
          user.password,
        );
        if (isMatchOldPassword) {
          throw new BadRequestException(
            this.i18n.t('user.NEW_AND_OLD_PASSWORD_NOT_SAME'),
          );
        }

        const saltOrRounds = 10;
        const salt = await bcrypt.genSalt(saltOrRounds);
        const passwordHash = await bcrypt.hash(
          changePasswordInput.newPassword,
          salt,
        );
        user.password = passwordHash;
        this.userRepository.save(user);

        res.success = true;
        res.message = this.i18n.t('user.PASSWORD_CHANGED');
        return res;
      } else {
        throw new BadRequestException(
          this.i18n.t('user.OLD_PASSWORD_IS_WRONG'),
        );
      }
    } else {
      throw new BadRequestException(this.i18n.t('user.OLD_PASSWORD_IS_WRONG'));
    }
  }

  /**
   *
   * @param editProfileInput
   * @param user
   * @returns
   */

  async editProfile(
    editProfileInput: EditProfileInput,
    user: User,
  ): Promise<Profile> {
    if (user) {
      if (user.is_block) {
        throw new BadRequestException(this.i18n.t('user.USER_BLOCKED'));
      }
      user.name = editProfileInput.name ? editProfileInput.name : user.name;
      user.mobile = editProfileInput.mobile
        ? editProfileInput.mobile
        : user.mobile;

      user.dob = editProfileInput.dob ? editProfileInput.dob : user.dob;

      const userId = await this.userRepository.save(user);

      const getUserProfile = await this.userRepository.findOne({
        where: { id: user.id },
        relations: { roles: true},
      });

      getUserProfile.profile_picture = this.imageUploadLib.getProfilePicture(
        user.profile_picture,
        this.PROFILE_PICTURE_UPLOAD_DIR,
      );
      return GetProfileResponse.decode(getUserProfile);
    } else {
      throw new HttpException(
        this.i18n.t('user.USER_NOT_FOUND'),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Block any user
   * @param blockedUserInput
   * @param user
   * @returns
   */
  async blockUser(
    blockedUserInput: BlockedUserInput,
    user: User,
  ): Promise<BooleanMessage> {
    const blockedToUser = await this.userRepository.findOne({
      where: { id: blockedUserInput.user_id },
    });
    if (!blockedToUser) {
      throw new BadRequestException(this.i18n.t('user.USER_NOT_FOUND'));
    }

    if (blockedToUser.is_block) {
      throw new BadRequestException(this.i18n.t('The user is already blocked by Admin.'));
    }
    // check if user is already blocked

    const alreadyBlocked = await this.blockedUserRepository.findOne({
      where: {
        blockedBy: { id: user.id },
        blockedTo: { id: blockedToUser.id },
      },
    });
    if (alreadyBlocked) {
      throw new BadRequestException(this.i18n.t('The user is already blocked'));
    }

    const blockedUser = new BlockedUser();
    blockedUser.blockedBy = user;
    blockedUser.blockedTo = blockedToUser;
    if (blockedUserInput.request_id) {
      blockedUser.reason =
        'You were not on time to attend session ID : ' +
        blockedUserInput.request_id;
    }

    await this.blockedUserRepository.save(blockedUser);

    const status = await this.statusRepository.findOne({
      where: { id: this.DEACTIVE },
    });
    //  Deactivate user (tutor) account
    blockedToUser.status = status;
    blockedToUser.updated_at = new Date(Date.now());
    blockedToUser.save();

    const booleanMessage = new BooleanMessage();
    booleanMessage.message = this.i18n.t('User blocked successful');
    booleanMessage.success = true;
    return booleanMessage;
  }

  /**
   *
   * @param filter
   * @returns
   */
  async findOneByPhone(country_code: string, mobile: string): Promise<User> {
    const result = await this.userRepository.findOne({
      where: { mobile: mobile },
    });
    return result;
  }

  /**
   *
   * @param filter
   * @returns
   */
  async findOneByPhoneandEmail(
    country_code: string,
    mobile: string,
    email: string,
  ): Promise<User> {
    const result = await this.userRepository.findOne({
      where: { mobile: mobile, email: email },
    });
    return result;
  }

  /**
   * check user exist
   * @param checkUserInput
   * @returns
   */
  async checkUser(checkUserInput: CheckUserInput): Promise<BooleanMessage> {
    let getUser: User;

    if (checkUserInput.checkUserBy === CheckUserBy.EMAILANDPHONE) {
      if (
        checkUserInput.email &&
        checkUserInput.country_code &&
        checkUserInput.mobile
      ) {
        getUser = await this.findOneByPhoneandEmail(
          checkUserInput.country_code,
          checkUserInput.mobile,
          checkUserInput.email,
        );
      } else {
        throw new BadRequestException(
          this.i18n.t('user.EMAIL_COUNTRY_CODE_MOBILE_REQUIRED'),
        );
      }
    }

    if (checkUserInput.checkUserBy === CheckUserBy.EMAIL) {
      if (checkUserInput.email) {
        getUser = await this.findOneByEmail(checkUserInput.email);
      } else {
        throw new BadRequestException(this.i18n.t('user.EMAIL_REQUIRED'));
      }
    }

    if (checkUserInput.checkUserBy === CheckUserBy.PHONE) {
      if (checkUserInput.country_code && checkUserInput.mobile) {
        getUser = await this.findOneByPhone(
          checkUserInput.country_code,
          checkUserInput.mobile,
        );
      } else {
        throw new BadRequestException(
          this.i18n.t('user.COUNTRY_CODE_MOBILE_REQUIRED'),
        );
      }
    }

    if (checkUserInput.checkUserBy === CheckUserBy.SOCIALID) {
      if (checkUserInput.socialId) {
        // getUser = await this.userRepository.findOne({ where: { social_id: checkUserInput.socialId } });
      } else {
        throw new BadRequestException(this.i18n.t('user.SOCIAL_ID_REQUIRED'));
      }
    }

    if (!getUser) {
      throw new NotFoundException(this.i18n.t('user.USER_NOT_FOUND'));
    }

    if (getUser.is_block) {
      throw new BadRequestException(this.i18n.t('user.USER_BLOCKED'));
    }

    const res = new BooleanMessage();
    res.success = true;
    res.message = this.i18n.t('user.USER_ALREADY_EXIST');
    return res;
  }

  /**
   * check is user block
   * @param isBlockInput
   * @returns
   */
  async isBlock(isBlockInput: IsBlockInput): Promise<BooleanMessage> {
    let getUser: User;

    if (isBlockInput.CheckBlockBy === SendOtpOn.EMAILANDPHONE) {
      if (
        isBlockInput.country_code &&
        isBlockInput.mobile &&
        isBlockInput.email
      ) {
        getUser = await this.findOneByPhoneandEmail(
          isBlockInput.country_code,
          isBlockInput.mobile,
          isBlockInput.email,
        );
      } else {
        throw new BadRequestException(
          this.i18n.t('user.EMAIL_COUNTRY_CODE_MOBILE_REQUIRED'),
        );
      };
    };

    if (isBlockInput.CheckBlockBy === SendOtpOn.EMAIL) {
      if (isBlockInput.email) {
        getUser = await this.findOneByEmail(isBlockInput.email);
      } else {
        throw new BadRequestException(this.i18n.t('user.EMAIL_REQUIRED'));
      };
    };

    if (isBlockInput.CheckBlockBy === SendOtpOn.PHONE) {
      if (isBlockInput.country_code && isBlockInput.mobile) {
        getUser = await this.findOneByPhone(
          isBlockInput.country_code,
          isBlockInput.mobile,
        );
      } else {
        throw new BadRequestException(
          this.i18n.t('user.COUNTRY_CODE_MOBILE_REQUIRED'),
        );
      }
    }
    if (!getUser) {
      throw new NotFoundException(this.i18n.t('user.USER_NOT_FOUND'));
    }

    if (getUser.is_block) {
      const res = new BooleanMessage();
      res.success = true;
      res.message = this.i18n.t('user.USER_BLOCKED');
      return res;
    }
  }
}
