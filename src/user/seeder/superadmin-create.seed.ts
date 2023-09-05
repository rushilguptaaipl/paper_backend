import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/database/user.entity';
import { Roles } from 'src/roles/database/roles.entity';
import { Status } from '../database/status.entity';

export class SuperAdminUserCreateSeed implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const data = [
      {
        name: 'SuperAdmin',
        email: 'superadmin@gmail.com',
        password: 'superadmin',
        status:1,
        roles: [],
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
      }
    ];

    const saltOrRounds = 10;
    const salt = await bcrypt.genSalt(saltOrRounds);

    for (let i = 0; i < data.length; i++) {
      const userExist = await User.find({ where: { email: data[i].email } });
      
      if (!userExist.length) {
        const roles = await Roles.find({ where: { name: 'SuperAdmin' } });
        const userStatus = await Status.findOneBy({ id: 1 });
        
        if (roles.length > 0) {
            const passwordHash = await bcrypt.hash(data[i].password, salt);
            const user = new User();
            user.name = data[i].name;
            user.email = data[i].email;
            user.password = passwordHash;
            user.status = userStatus;
            user.created_at = data[i].created_at;
            user.updated_at = data[i].updated_at;
            user.roles = roles; // Associate the roles with the user
  
            await connection.manager.save(user);
          }
      }
    }
  }
}
