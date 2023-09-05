import { Injectable, HttpException, HttpStatus, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, NotBrackets, Repository } from 'typeorm';
import { User } from '../database/user.entity';
import { Roles } from '../../roles/database/roles.entity';
import { Status } from '../database/status.entity';
import { Otp } from '../database/otp.entity';
import { I18nService } from 'nestjs-i18n';
import { ImageUploadLib } from 'src/libs/image-upload.lib';
import { GetStatusResponse } from '../response/admin/get-status.response';
import { GetStatus } from '../entities/admin/get-status.entity';
import { AdminProfile } from '../entities/admin/admin-profile.entity';
import { GetAdminProfileResponse } from '../response/admin/admin-profile.response';
import { ListUserInput } from '../dto/admin/list-user-admin.input';
import { UserAdmin } from '../entities/admin/list-user-entity';
import { GetListUserResponse } from '../response/admin/list-user.response';
import { AdminUserStatusInput } from '../dto/admin/admin-user-status.input';
import { BooleanMessage } from '../entities/boolean-message.entity';
import { AppDataSource } from 'app-data-source';
import { AdminListTransactionInput } from '../dto/admin/admin-list-transaction.input';
import { AdminListTransaction } from '../entities/admin/admin-list-transaction.entity';
import { AdminListTransactionResponse } from '../response/admin/admin-transaction-history.response';
import { isEmpty } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { AdminGetUserProfileInput } from '../dto/admin/admin-get-user-profile.input'
import { AdminVerifiesUserInput } from '../dto/admin/admin-verifies-user.input';
import { CustomerGroupInput } from '../dto/admin/admin-customer-group.input';
import { CustomerGroup } from 'src/user/database/customer-group.entity';
import { AdminRepository } from '../repositories/admin/admin-user-group.repository';
import { UpdateCustomerGroupInput } from '../dto/admin/admin-update-customer-group.input';
import { DeleteCustomerGroupInput } from '../dto/admin/admin-delete-customer-group';
import { ListCustomerGroupInput } from '../dto/admin/admin-list-group.input';
import { GetCustomerGroupResponse } from '../response/admin/admin-customer-group.response';
import { ListCustomerGroup } from '../entities/admin/admin-list-customer-group.entity';
import { AdminUpdateUserInput } from '../dto/admin/admin-update-users.input';
import { AdminCreateUserInput } from '../dto/admin/admin-create-users.input';


@Injectable()
export class AdminService {

    private PROFILE_PICTURE_UPLOAD_DIR: string = 'avatar';
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Roles)
        private rolesRepository: Repository<Roles>,
        @InjectRepository(Status)
        private statusRepository: Repository<Status>,
        private readonly _adminRepository: AdminRepository,
        private readonly i18n: I18nService,
        private imageUploadLib: ImageUploadLib,
    ) { }

    async adminCreateUser(createUserInput: AdminCreateUserInput): Promise<BooleanMessage> {

        const checkEmail = await this.userRepository.findOne({ where: { email: createUserInput.email.toLowerCase() }, withDeleted: true });
        if (checkEmail) {
            throw new BadRequestException(this.i18n.t('user.EMAIL_ALREADY_EXIST'));
        }

        const roles = []
        for (let i = 0; i < createUserInput.role.length; i++) {
            const role = await this.rolesRepository.findOne({ where: { id: createUserInput.role[i] } });
            roles.push(role)
        }
        if ((roles.length - 1) < 1) {
            throw new NotFoundException(this.i18n.t('user.ROLE_NOT_FOUND'));
        }

        const getStatus = await this.statusRepository.findOneBy({ id: createUserInput.status });
        if (!getStatus) {
            throw new NotFoundException(this.i18n.t('user.STATUS_NOT_FOUND'))
        }


        const saltOrRounds = 10;
        const salt = await bcrypt.genSalt(saltOrRounds);
        const passwordHash = await bcrypt.hash(createUserInput.password, salt);

        const user = new User();
        user.name = createUserInput.name;
        user.email = createUserInput.email.toLowerCase();
        user.mobile = createUserInput.mobile;
        user.dob = createUserInput.dob;
        user.password = passwordHash;
        user.roles = roles;
        user.status = getStatus;
        user.created_at = new Date(Date.now());
        user.updated_at = new Date(Date.now());

        const userResult = await this.userRepository.save(user);
        if (!userResult) {
            throw new BadRequestException('Something went wrong!');
        }

        const response = new BooleanMessage();
        response.success = true;
        response.message = this.i18n.t('user.USER_CREATED_SUCCESSFULLY');
        return response;
    }

    /**
     * admin get status
     * @param user 
     * @returns 
     */
    async adminGetStatus(user: any): Promise<GetStatus> {
        const status = await this.statusRepository.find();

        if (!status) {
            throw new NotFoundException(this.i18n.t('user.STATUS_NOT_FOUND'));
        }

        return GetStatusResponse.decode(status);
    }

    /**
     * admin get profile
     * @param adminGetUserProfileInput 
     * @param user 
     * @returns 
     */
    async adminGetUserProfile(adminGetUserProfileInput: AdminGetUserProfileInput, user: User): Promise<AdminProfile> {

        const getUser = await this.userRepository.findOne({ where: { id: adminGetUserProfileInput.user_id }, relations: { roles: true, status: true} });
        if (getUser.is_block) {
            throw new BadRequestException(this.i18n.t('user.USER_BLOCKED'))
        }
        if (getUser) {
            getUser.profile_picture = this.imageUploadLib.getProfilePicture(getUser.profile_picture, this.PROFILE_PICTURE_UPLOAD_DIR);
            return GetAdminProfileResponse.decode(getUser);
        } else {
            throw new NotFoundException(this.i18n.t('user.USER_NOT_FOUND'));
        }
    }

    /**
     * admin list all users and search users 
     * @param listUserInput 
     * @param user 
     * @returns 
     */
    async adminListUser(listUserInput: ListUserInput, user: User): Promise<UserAdmin> {

        const [listUser, count] = await this.userRepository.createQueryBuilder('user')
            .leftJoinAndSelect('user.status', 'status')
            .leftJoinAndSelect('user.userAdditionalInformation', 'userAdditionalInformation')
            .leftJoinAndSelect('user.roles', 'roles')
            .where(listUserInput.role_id == null ? isEmpty : 'roles.id = :id', { id: listUserInput.role_id })
            .andWhere(new Brackets(qb => {
                listUserInput.search == null ? isEmpty :
                    qb.where('LOWER(user.name) LIKE :name', { name: `%${listUserInput.search.toLowerCase()}%` })
                        .orWhere('user.email LIKE :email', { email: `%${listUserInput.search.toLowerCase()}%` })
            }))
            .skip(listUserInput.skip)
            .take(listUserInput.take)
            .getManyAndCount();

        const result = { adminListUser: listUser, count: count }

        if (!listUser.length) {
            throw new NotFoundException(this.i18n.t('user.USER_NOT_FOUND'));
        }

        return GetListUserResponse.decode(result);
    }

    /**
     * admin update users status
     * @param adminUserStatusInput 
     * @param user 
     * @returns 
     */
    async adminUserUpdateStatus(adminUserStatusInput: AdminUserStatusInput, user: User): Promise<BooleanMessage> {

        const getUser = await this.userRepository.findOne({ where: { id: adminUserStatusInput.user_id }, relations: { status: true } });
        const status = await this.statusRepository.findOne({ where: { id: adminUserStatusInput.status_id } })

        if (!getUser) {
            throw new NotFoundException(this.i18n.t('user.USER_NOT_FOUND'));
        }

        if (getUser.is_block) {
            throw new BadRequestException(this.i18n.t('user.USER_BLOCKED'))
        }

        if (!status) {
            throw new NotFoundException(this.i18n.t('user.STATUS_NOT_FOUND'));
        }
        getUser.status = status;

        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.startTransaction();
        try {

            await queryRunner.manager.update(User, getUser.id, getUser);
            await queryRunner.commitTransaction()

        } catch (err) {
            await queryRunner.rollbackTransaction()
            throw new BadRequestException('Something went wrong!');

        } finally {
            await queryRunner.release()
        }

        const response = new BooleanMessage();
        response.success = true;
        response.message = this.i18n.t('user.STATUS_UPDATED');
        return response;
    }

    async adminListStudentTransactionHistory(adminListTransactionInput: AdminListTransactionInput, user: User): Promise<AdminListTransaction> {

        return null;
    }

    /**
     * delete user
     * @param user 
     * @returns Boolean Message
     */
    async deleteUser(userId: number): Promise<BooleanMessage> {

        await this.userRepository.softDelete(userId);

        const response = new BooleanMessage();
        response.success = true;
        response.message = this.i18n.t('user.DELETED_SUCCESSFULLY');
        return response;
    }

    /**
     * 
     * @param adminVerifiesUserInput 
     * @returns 
     */

    async adminVerifiesUser(adminVerifiesUserInput: AdminVerifiesUserInput): Promise<BooleanMessage> {

        const ifUserExists = await this.userRepository.findOne({
            where: { id: adminVerifiesUserInput.user_id }
        })

        if (ifUserExists.is_block) {
            throw new BadRequestException(this.i18n.t('user.USER_BLOCKED'))
        };

        if (ifUserExists) {
            await this.userRepository.update(
                { id: adminVerifiesUserInput.user_id },
                {
                    is_admin_verified: adminVerifiesUserInput.is_verified,
                    updated_at: new Date(Date.now()),
                }
            )


            const response = new BooleanMessage();
            response.success = true;
            if (adminVerifiesUserInput.is_verified) {
                response.message = this.i18n.t('user.USER_VERIFIED');
            } else {
                response.message = this.i18n.t('user.USER_UNVERIFIED');
            }

            return response;
        }
        else {
            const response = new BooleanMessage();
            response.success = false;
            response.message = this.i18n.t('user.BAD_REQUEST_INPUT');
            return response;
        }
    }

    /**
     * update all users
     * @param adminUpdateUserInput 
     * @returns BooleanMessage
     */
    async adminUpdateUser(adminUpdateUserInput: AdminUpdateUserInput): Promise<BooleanMessage> {

        const getUser = await this.userRepository.findOne({ where: { id: adminUpdateUserInput.user_id }, relations: { roles: true } });
        const role = await this.rolesRepository.findBy({ id: adminUpdateUserInput.role });

        if (!getUser) {
            throw new NotFoundException(this.i18n.t('user.USER_NOT_FOUND'));
        }

        if (!role.length) {
            throw new NotFoundException(this.i18n.t('user.ROLE_NOT_FOUND'));
        }

        getUser.name = adminUpdateUserInput.name;
        getUser.mobile = adminUpdateUserInput.mobile;
        getUser.dob = adminUpdateUserInput.dob;
        getUser.roles = role;
        adminUpdateUserInput.updated_at = new Date(Date.now());

        /** Transaction Start */
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            // update user
            await queryRunner.manager.save(getUser);
            await queryRunner.commitTransaction()

        } catch (err) {
            console.log(err)
            await queryRunner.rollbackTransaction()
            throw new BadRequestException('Something went wrong!');

        } finally {
            await queryRunner.release()
        }

        const response = new BooleanMessage();
        response.success = true;
        response.message = this.i18n.t(this.i18n.t('user.UPDATED_SUCCESSFULLY'));
        return response;
    }

    /**
     * Admin block a user
     * @param userId 
     * @returns 
     */
    async adminBlockUser(userId: number): Promise<BooleanMessage> {
        const getUser = await this.userRepository.findOne({ where: { id: userId } });
        if (!getUser) {
            throw new NotFoundException(this.i18n.t('user.USER_NOT_FOUND'));
        }

        if (getUser.is_block) {
            throw new BadRequestException(this.i18n.t('user.USER_ALREADY_BLOCKED'))
        };
        getUser.is_block = true
        await this.userRepository.save(getUser);

        const response = new BooleanMessage();
        response.success = true;
        response.message = this.i18n.t(this.i18n.t('user.BLOCKED_SUCCESSFULLY'));
        return response;
    }

    /**
     * admin Unblock a user
     * @param userId 
     * @returns 
     */
    async adminUnblockUser(userId: number): Promise<BooleanMessage> {
        const getUser = await this.userRepository.findOne({ where: { id: userId } });
        if (!getUser) {
            throw new NotFoundException(this.i18n.t('user.USER_NOT_FOUND'));
        }

        if (!(getUser.is_block)) {
            throw new BadRequestException(this.i18n.t('user.USER_ALREADY_UNBLOCKED'))
        };

        getUser.is_block = false;
        await this.userRepository.save(getUser);

        const response = new BooleanMessage();
        response.success = true;
        response.message = this.i18n.t(this.i18n.t('user.UNBLOCKED_SUCCESSFULLY'));
        return response;
    }


    /**
     * Create Customer Group
     * @param customerGroupInput 
     * @returns BooleanMessage
     */
    async adminCreateCustomerGroup(customerGroupInput: CustomerGroupInput): Promise<BooleanMessage> {

        await this._adminRepository.adminCreateCustomerGroup(customerGroupInput);

        const response = new BooleanMessage();
        response.success = true;
        response.message = this.i18n.t('user.CUSTOMER_GROUP_SUCCESSFULLY');
        return response;
    }

    /**
     * Update Customer Group
     * @param updateCustomerGroupInput 
     * @returns BooleanMessage
     */
    async adminUpdateCustomerGroup(updateCustomerGroupInput: UpdateCustomerGroupInput): Promise<BooleanMessage> {

        await this._adminRepository.adminUpdateCustomerGroup(updateCustomerGroupInput);

        const response = new BooleanMessage();
        response.success = true;
        response.message = this.i18n.t('user.CUSTOMER_GROUP_UPDATE');
        return response;
    }

    /**
     * Delete customer group by Id
     * @param deleteCustomerGroupInput 
     * @returns BooleanMessage
     */
    async adminDeleteCustomerGroup(deleteCustomerGroupInput: DeleteCustomerGroupInput): Promise<BooleanMessage> {
        await this._adminRepository.adminDeleteCustomerGroup(deleteCustomerGroupInput);

        const response = new BooleanMessage();
        response.success = true;
        response.message = this.i18n.t('user.DELETE_GROUP_SUCCESSFULLY');
        return response;
    }

    /**
     * listing customer group
     * @param listCustomerGroupInput 
     * @returns customer groups
     */
    async adminListCustomerGroup(listCustomerGroupInput: ListCustomerGroupInput): Promise<ListCustomerGroup[]> {
        const response = await this._adminRepository.adminListCustomerGroup(listCustomerGroupInput);

        if (!response.length) {
            throw new NotFoundException(this.i18n.t('user.NO_CUSTOMER_GROUP_FOUND'));
        }

        return GetCustomerGroupResponse.decode(response);
    }
}


