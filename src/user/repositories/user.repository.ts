import { BadRequestException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityRepository, IsNull, Repository } from "typeorm";
import { User } from "../database/user.entity";
import * as bcrypt from 'bcrypt';
import { CreateUserInput } from '../dto/create-user.input';
import { AppDataSource } from "app-data-source";
import { UserAdditionalInformation } from "../database/user-additional.entity";
import { Roles } from "../../roles/database/roles.entity";
import { Status } from "../database/status.entity";
import { generate, Charset } from 'referral-codes'
import { I18nService } from 'nestjs-i18n';
import { CustomerGroup } from "../database/customer-group.entity";

@EntityRepository(User)
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Roles)
    private rolesRepository: Repository<Roles>,
    @InjectRepository(Status)
    private statusRepository: Repository<Status>,
    @InjectRepository(CustomerGroup)
    private customerRepository: Repository<CustomerGroup>,
    private readonly i18n: I18nService,

  ) { }

  async getUserById(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId }, relations: { roles: true, status: true } })
    if (!user) {
      throw new BadRequestException('No user found');
    }

    if (user.is_block) {
      throw new BadRequestException(this.i18n.t('user.USER_BLOCKED'))
    };

    if (!user.status || user.status.id != 1) {
      throw new BadRequestException('Your account is deactivated');
    }
    return user
  }

  async doLogin(username: string, password: string, role: number): Promise<User> {

    let user: User
    if (role) {
      user = await this.userRepository.findOne({ where: { email: username, roles: [{ id: role }] }, relations: { roles: true, status: true, userAdditionalInformation: true } });
    } else {
      user = await this.userRepository.findOne({ where: { email: username }, relations: { roles: true, status: true, userAdditionalInformation: true } });
    }

    if (user) {
      if (user.is_block) {
        throw new BadRequestException(this.i18n.t('user.USER_BLOCKED'))
    };
      if (!user.status || user.status.id != 1) {
        throw new BadRequestException('Your account is deactivated');
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        return user;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  async updateRtHash(userId: number, rt: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId }, relations: { roles: true } });
    if (user) {
      user.hashRt = rt;
      await this.userRepository.save(user);
    }
  }

  /**
   * 
   * @param createUserInput 
   * @returns 
   */
  async createUser(createUserInput: CreateUserInput): Promise<User> {

    const referral_code = generate({
      length: 6,
      count: 1
    })

    // check if user has any referral code to use in request we will validate here
    let userWhoRefer
    if (createUserInput.referral_code) {
      userWhoRefer = await this.userRepository.findOne({ where: { referral_code: createUserInput.referral_code }, relations: { userAdditionalInformation: true } });
      if (!userWhoRefer) {
        throw new BadRequestException('Referral code is wrong!');
      }
    }

    const customerGroup = await this.customerRepository.findOne({ where: { id: 1 } });

    const saltOrRounds = 10;
    const salt = await bcrypt.genSalt(saltOrRounds);
    const passwordHash = await bcrypt.hash(createUserInput.password, salt);
    const role = await this.rolesRepository.findBy({ id: createUserInput.role });

    const userStatus = await this.statusRepository.findOneBy({ id: 1 });
    const user = new User();
    user.name = createUserInput.name;
    user.email = createUserInput.email.toLowerCase();
    user.mobile = createUserInput.mobile;
    user.country_code = createUserInput.country_code;
    user.dob = createUserInput.dob;
    user.password = passwordHash;
    user.roles = role;
    user.status = userStatus;
    user.customerGroup = customerGroup;

    if (!role.length) {
      throw new NotFoundException(this.i18n.t('user.ROLE_NOT_FOUND'));
    }

    if (!customerGroup) {
      throw new NotFoundException(this.i18n.t('user.CUSTOMER_NOT_FOUND'));
    }


    // generate referral code for student only
    if (createUserInput.role == 1) {
      user.referral_code = referral_code[0];
    }

    if (createUserInput.referral_code) {
      user.referral_code_used = createUserInput.referral_code;
    }

    if (createUserInput.is_verified == 1) {
      user.is_verified = 1;
      user.email_verified_at = new Date(Date.now());
    }
    user.created_at = new Date(Date.now());
    user.updated_at = new Date(Date.now());


    /** Transaction start here  */
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const userResult = await queryRunner.manager.save(user);

      if (createUserInput.role == 1) {
        const userAdditionalInformation = new UserAdditionalInformation();
        userAdditionalInformation.total_credits = 1;
        userAdditionalInformation.user = userResult;
        await queryRunner.manager.save(userAdditionalInformation);

      }

      // if user use the Referral code we have to give one credit to the owner of referral code
      if (userWhoRefer) {
        let oldCredits = 0;
        if (userWhoRefer.userAdditionalInformation) {
          oldCredits = userWhoRefer.userAdditionalInformation.total_credits;
        }
        const userAdditionalInformation = new UserAdditionalInformation();
        userAdditionalInformation.total_credits = oldCredits + 1;
        if (userWhoRefer.userAdditionalInformation) {
          await queryRunner.manager.update(UserAdditionalInformation, userWhoRefer.userAdditionalInformation.id, userAdditionalInformation);
        } else {
          userAdditionalInformation.user = userWhoRefer;
          await queryRunner.manager.save(userAdditionalInformation);
        }

      }

      await queryRunner.commitTransaction()

      const userData = await this.userRepository.findOne({ where: { id: userResult.id }, relations: { roles: true, userAdditionalInformation: true } });

      return userData;
    } catch (err) {
      console.log(err)
      await queryRunner.rollbackTransaction()
      throw new BadRequestException('Something went wrong!');

    } finally {
      await queryRunner.release()
    }
  }

}