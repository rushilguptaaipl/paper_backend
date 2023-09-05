import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Status } from 'src/user/database/status.entity';

export class StatusSeed implements Seeder {
    public async run(factory: Factory, connection: Connection) {
        const data = [
        {
            name: 'Active',
            created_at: new Date(Date.now()),
            updated_at: new Date(Date.now()),
        },
        {
            name: 'Deactive',
            created_at: new Date(Date.now()),
            updated_at: new Date(Date.now()),
        }
    ];

    for (var i = 0; i < data.length; i++) {
        const statusExist = await Status.find({ where: { name: data[i].name }});
        if (!statusExist.length) {
            await connection.createQueryBuilder().insert().into(Status).values(data[i]).execute();
        }
     }   
  }
} 