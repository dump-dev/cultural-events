import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";
import User from "../entities/User";
import "dotenv/config";
import { RoleEnum } from "../../constants/role";

export default class UserAdmin1756050977754 implements Seeder {
  track = false;

  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<any> {
    const repository = dataSource.getRepository(User);
    const user = new User();
    user.name = process.env.SEED_ADMIN_NAME as string;
    user.authEmail = process.env.SEED_ADMIN_EMAIL as string;
    user.password = process.env.SEED_ADMIN_PASSWORD as string;
    user.role = RoleEnum.ADMIN;
    await repository.save(user);
  }
}
