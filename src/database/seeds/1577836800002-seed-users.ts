import { Factory, Seeder } from "typeorm-seeding";
import { Connection } from "typeorm";
import { User } from "../../entities/User";
import argon2 from "argon2";

export default class SeedUsers1577836800002 implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    factory;
    await connection
      .createQueryBuilder()
      .insert()
      .into(User)
      .values([
        {
          accountId: 1,
          id: 1,
          uuid: "00000000-0000-0000-0000-000000000001",
          firstName: "Tiago",
          lastName: "Conceição",
          email: "tiago@user.com",
          password: await argon2.hash("12345"),
          cpf: "01655014560",
          isActive: true,
        },
        {
          accountId: 1,
          id: 2,
          uuid: "00000000-0000-0000-0000-000000000002",
          firstName: "Eduardo",
          lastName: "Silva",
          email: "eduardo@user.com",
          password: await argon2.hash("12345"),
          isActive: true,
        },
      ])
      .execute();
  }
}
