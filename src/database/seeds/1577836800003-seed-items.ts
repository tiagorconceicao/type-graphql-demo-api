import { Factory, Seeder } from "typeorm-seeding";
import { Connection } from "typeorm";
import { Item } from "../../entities/Item";

export default class SeedItems1577836800003 implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    factory;
    await connection
      .createQueryBuilder()
      .insert()
      .into(Item)
      .values([
        {
          accountId: 1,
          id: 1,
          uuid: "00000000-0000-0000-0000-000000000001",
          name: "Caneca",
          description: "Descrição da caneca simples.",
          isAvailable: true,
          isUnlimited: false,
          isActive: true,
        },
        {
          accountId: 1,
          id: 2,
          uuid: "00000000-0000-0000-0000-000000000002",
          name: "Copo de acrílico",
          description: "Descrição do copo de acrílico.",
          isAvailable: true,
          isUnlimited: false,
          isActive: true,
        },
        {
          accountId: 1,
          id: 3,
          uuid: "00000000-0000-0000-0000-000000000003",
          name: "Poster",
          description: "Descrição do poster",
          isAvailable: true,
          isUnlimited: true,
          isActive: true,
        },
        {
          accountId: 1,
          id: 4,
          uuid: "00000000-0000-0000-0000-000000000004",
          name: "Camisa M Masculina",
          description: "Descrição da camisa.",
          isAvailable: true,
          isUnlimited: false,
          isActive: true,
        },
        {
          accountId: 1,
          id: 5,
          uuid: "00000000-0000-0000-0000-000000000005",
          name: "Camisa M Femenina",
          description: "Descrição da camisa.",
          isAvailable: true,
          isUnlimited: false,
          isActive: true,
        },
      ])
      .execute();
  }
}
