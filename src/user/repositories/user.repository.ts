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
      user = await this.userRepository.findOne({ where: { email: username, roles: [{ id: role }] }, relations: { roles: true, status: true,} });
    } else {
      user = await this.userRepository.findOne({ where: { email: username }, relations: { roles: true, status: true } });
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

    const saltOrRounds = 10;
    const salt = await bcrypt.genSalt(saltOrRounds);
    const passwordHash = await bcrypt.hash(createUserInput.password, salt);
    const role = await this.rolesRepository.findBy({ id: createUserInput.role });

    const userStatus = await this.statusRepository.findOneBy({ id: 1 });
    const user = new User();
    user.name = createUserInput.name;
    user.email = createUserInput.email.toLowerCase();
    user.mobile = createUserInput.mobile;
    user.dob = createUserInput.dob;
    user.password = passwordHash;
    user.roles = role;
    user.status = userStatus;

    if (!role.length) {
      throw new NotFoundException(this.i18n.t('user.ROLE_NOT_FOUND'));
    }

    user.created_at = new Date(Date.now());
    user.updated_at = new Date(Date.now());


    /** Transaction start here  */
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const userResult = await queryRunner.manager.save(user);
      await queryRunner.commitTransaction()

      const userData = await this.userRepository.findOne({ where: { id: userResult.id }, relations: { roles: true } });

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