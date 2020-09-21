import { Factory, Seeder } from "typeorm-seeding";
import { Connection } from "typeorm";
import { ItemTransaction } from "../../entities/ItemTransaction";

export default class SeedItemTransactions1577836800004 implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    factory;
    await connection
      .createQueryBuilder()
      .insert()
      .into(ItemTransaction)
      .values([
        {
          itemId: 1,
          quantity: 100,
          description: "Abertura de inventário.",
        },
        {
          itemId: 2,
          quantity: 85,
          description: "Abertura de inventário.",
        },
        {
          itemId: 3,
          quantity: 10,
          description: "Abertura de inventário.",
        },
        {
          itemId: 4,
          quantity: 150,
          description: "Abertura de inventário.",
        },
        {
          itemId: 4,
          quantity: 30,
          description: "Abertura de inventário.",
          outbound: true,
        },
      ])
      .execute();
  }
}
