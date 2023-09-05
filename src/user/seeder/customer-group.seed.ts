import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { CustomerGroup } from 'src/user/database/customer-group.entity';
import { Status } from 'src/user/database/status.entity';

export class CustomerGroupSeed implements Seeder {
    public async run(factory: Factory, connection: Connection) {
        let STATUS: number = 1;
        const status = await Status.findOne({ where: { id: STATUS } });

        const data = [
            {
                name: 'Default',
                description: 'Default Customer',
                status: status,
                sort_order: 1,
                created_at: new Date(Date.now()),
                updated_at: new Date(Date.now()),
            },
        ];

        for (var i = 0; i < data.length; i++) {
            const customerGroupExist = await CustomerGroup.find({ where: { name: data[i].name } });
            if (!customerGroupExist.length) {
                await connection.createQueryBuilder().insert().into(CustomerGroup).values(data[i]).execute();
            }
        }
    }
} 