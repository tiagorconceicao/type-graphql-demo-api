import { Factory, Seeder } from "typeorm-seeding";
import { Connection } from "typeorm";
import { Account } from "../../entities/Account";
import argon2 from "argon2";

export default class SeedAccounts1577836800001 implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    factory;
    await connection
      .createQueryBuilder()
      .insert()
      .into(Account)
      .values([
        {
          id: 1,
          uuid: "00000000-0000-0000-0000-000000000001",
          name: "Aurora",
          slug: "aurora",
          email: "aurora@aurora.com",
          password: await argon2.hash("12345"),
          isActive: true,
        },
        {
          id: 2,
          uuid: "00000000-0000-0000-0000-000000000002",
          name: "Solaris",
          slug: "solaris",
          email: "solaris@solaris.com",
          password: await argon2.hash("12345"),
          isActive: true,
        },
      ])
      .execute();
  }
}
