import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { Roles } from 'src/roles/database/roles.entity';

export class RolesCreateSeed implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const data = [
      {
        name: 'SuperAdmin',
        is_admin:true,
        is_super_admin:true,
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
      }
    ];

    for (var i = 0; i < data.length; i++) {
      const roleExist = await Roles.find({ where: { name: data[i].name } });
      if (!roleExist.length) {
        await connection.createQueryBuilder().insert().into(Roles).values(data[i]).execute();
      }
    }
  }
}
