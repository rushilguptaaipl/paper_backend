import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { I18nService } from "nestjs-i18n";
import { BooleanMessage } from "src/user/entities/boolean-message.entity";
import { Repository } from "typeorm";
import { Roles } from "../database/roles.entity";
import { CreateRoleInput } from "../dto/admin/create-role.input";
import { ListRoleInput } from "../dto/admin/list-role.input";
import { UpdateRoleInput } from "../dto/admin/update-role.input";
import { RolesListAdmin } from "../entities/admin/list-role.entity";
import { UserRoles } from "../entities/roles.entity";
import { AdminRepository } from "../repositories/admin/admin.repository";
import { GetRolesListResponse } from "../response/admin/list-role.response";
import { GetRoleResponse } from "../response/roles.response";

@Injectable()
export class AdminService{
    constructor(
        @InjectRepository(Roles) 
        private rolesRepository: Repository<Roles>,
        private _rolesRepository:AdminRepository,
        private readonly i18n: I18nService){}

    /**
     * create role
     * @param id 
     * @returns
     */    
    async adminCreateRole(roleInput:CreateRoleInput):Promise<BooleanMessage> {
        await this._rolesRepository.adminCreateRole(roleInput);
        const response = new BooleanMessage();
        response.success = true;
        response.message = this.i18n.t('role.ROLE_CREATED_SUCCESSFULLY');
        return response;
    }

    /**
     * update role
     * @param id 
     * @returns
     */
    async adminUpdateRole(roleInput:UpdateRoleInput):Promise<BooleanMessage> {
        await this._rolesRepository.adminUpdateRole(roleInput);
        const response = new BooleanMessage();
        response.success = true;
        response.message = this.i18n.t('role.ROLE_UPDATED_SUCCESSFULLY');
        return response;
    }

    /**
     * get all roles
     * @param listRoleInput 
     * @returns
     */
    async adminListRoles(listRoleInput:ListRoleInput): Promise<RolesListAdmin> {
        const response = await this.rolesRepository.find({ skip: listRoleInput.skip, take: listRoleInput.take, order: {updated_at: "DESC"}, where: { is_super_admin: false } });

        if (!response.length) {
            throw new NotFoundException(this.i18n.t('role.NO_ROLE_FOUND'))
        }

        return GetRolesListResponse.decode(response);
    }

    /**
     * get role by id
     * @param id 
     * @returns
     */
    async adminGetRoleById(id:number): Promise<UserRoles>{
        let role = await this.rolesRepository.findOne({ where: { id, is_super_admin: false} });
        if(!role) throw new NotFoundException(this.i18n.t('role.ROLE_NOT_FOUND'));

        return GetRoleResponse.decode(role);
    }
    
    /**
     * delete role
     * @param id 
     * @returns Boolean Message
     */
    async adminDeleteRole(id: number): Promise<BooleanMessage> {
        const roleExist = await this.rolesRepository.findOne({ where: { id } });

        if (!roleExist) {
            throw new NotFoundException(this.i18n.t('role.ROLE_NOT_FOUND'))
        }

        await this.rolesRepository.softDelete(id);
        
        const response = new BooleanMessage();
        response.success = true;
        response.message = this.i18n.t('role.ROLE_DELETED_SUCCESSFULLY');

        return response;
    }
}