import { Factory, Seeder } from "typeorm-seeding";
import { Connection } from "typeorm";
import { Admin } from "../../entities/Admin";
import argon2 from "argon2";

export default class SeedAdmins1577836800000 implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    factory;
    await connection
      .createQueryBuilder()
      .insert()
      .into(Admin)
      .values([
        {
          id: 1,
          uuid: "00000000-0000-0000-0000-000000000001",
          firstName: "Master",
          lastName: "Admin",
          email: "admin@admin.com",
          password: await argon2.hash("12345"),
          isActive: true,
        },
      ])
      .execute();
  }
}
