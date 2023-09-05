import { InjectRepository } from "@nestjs/typeorm";
import { EntityRepository, Repository } from "typeorm";
import { I18nService } from 'nestjs-i18n';
import { User } from "src/user/database/user.entity";
import { Status } from "src/user/database/status.entity";
import { CustomerGroup } from "src/user/database/customer-group.entity";
import { Injectable, NotFoundException } from '@nestjs/common';
import { ListCustomerGroupInput } from "src/user/dto/admin/admin-list-group.input";

@Injectable()
export class AdminRepository {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Status)
        private statusRepository: Repository<Status>,
        @InjectRepository(CustomerGroup)
        private customerRepository: Repository<CustomerGroup>,
        private readonly i18n: I18nService,

    ) { }

    /**
     * admin create customer group
     * @param customerGroupInput 
     * @returns 
     */
    async adminCreateCustomerGroup(customerGroupInput: any): Promise<CustomerGroup> {

        const customer = new CustomerGroup();

        const status = await this.statusRepository.findOne({ where: { id: customerGroupInput.status } });

        if (!status) {
            throw new NotFoundException(this.i18n.t('user.STATUS_NOT_FOUND'));
        }

        if (customerGroupInput.sort_order < 0) {
            throw new NotFoundException(this.i18n.t('user.SORT_ORDER_INVALID'));
        }

        customer.name = customerGroupInput.name;
        customer.description = customerGroupInput.description;
        customer.status = status;
        customer.sort_order = customerGroupInput.sort_order;
        customer.created_at = new Date(Date.now());
        customer.updated_at = new Date(Date.now());

        return await this.customerRepository.save(customer);
    }

    /**
     * admin update customer group
     * @param updateCustomerGroupInput 
     */
    async adminUpdateCustomerGroup(updateCustomerGroupInput: any): Promise<void>  {

        const customerExist = await this.customerRepository.findOne({ where: { id: updateCustomerGroupInput.id } });
        if (!customerExist) {
            throw new NotFoundException(this.i18n.t('user.CUSTOMER_GROUP_NOT_FOUND'));
        }

        const status = await this.statusRepository.findOne({ where: { id: updateCustomerGroupInput.status } });
        if (!status) {
            throw new NotFoundException(this.i18n.t('user.STATUS_NOT_FOUND'));
        }

        if (updateCustomerGroupInput.sort_order < 0) {
            throw new NotFoundException(this.i18n.t('user.SORT_ORDER_INVALID'));
        }

        updateCustomerGroupInput.updated_at = new Date(Date.now());

        await this.customerRepository.update(customerExist.id, updateCustomerGroupInput);
    }

    /**
     * admin delete customer group
     * @param deleteCustomerGroupInput 
     */
    async adminDeleteCustomerGroup(deleteCustomerGroupInput: any): Promise<void>  {

        const customerExist = await this.customerRepository.findOne({ where: { id: deleteCustomerGroupInput.customerGroupId } });

        if (!customerExist) {
            throw new NotFoundException(this.i18n.t('user.CUSTOMER_GROUP_NOT_FOUND'));
        }

        await this.customerRepository.softDelete(customerExist.id);

    }

    /**
     * list customer group
     * @param listCustomerGroupInput 
     * @returns 
     */
    async adminListCustomerGroup(listCustomerGroupInput: ListCustomerGroupInput) {
        return await this.customerRepository.find({ relations: { status: true }, order: { updated_at: "DESC" } ,take: listCustomerGroupInput.take, skip: listCustomerGroupInput.skip, });
    }
}