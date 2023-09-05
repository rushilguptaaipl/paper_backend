import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from 'typeorm';
import { Status } from "src/user/database/status.entity";
import { NotFoundException } from '@nestjs/common';
import { I18nService } from "nestjs-i18n";
import { Roles } from "src/roles/database/roles.entity";
import { CreateRoleInput } from "src/roles/dto/admin/create-role.input";
import { UpdateRoleInput } from "src/roles/dto/admin/update-role.input";

export class AdminRepository {
    constructor(
        @InjectRepository(Roles)
        private rolesRepository: Repository<Roles>,
        private readonly i18n: I18nService,
    ) { }

    async adminCreateRole(createRoleInput: CreateRoleInput) {

        const role = new Roles();
        role.name = createRoleInput.name;
        role.is_admin = createRoleInput.is_admin;
        role.permissions = createRoleInput.permissions;
        role.created_at = new Date(Date.now());
        role.updated_at = new Date(Date.now());
        
        await this.rolesRepository.save(role);

    }

    async adminUpdateRole(updateRoleInput: UpdateRoleInput) {
        const role = await this.rolesRepository.findOne({ where: { id: updateRoleInput.id } });
        if (!role) {
            throw new NotFoundException(this.i18n.t('role.ROLE_NOT_FOUND'));
        }

        role.name = updateRoleInput.name;
        role.is_admin = updateRoleInput.is_admin;
        role.permissions = updateRoleInput.permissions;
        role.updated_at = new Date(Date.now());
        await this.rolesRepository.save(role);
    }
}