import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateTtemTransactions1577836800004 implements MigrationInterface {
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("itemTransactions");
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "itemTransactions",
        columns: [
          {
            name: "id",
            type: "integer",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "itemId",
            type: "integer",
          },
          {
            name: "quantity",
            type: "integer",
          },
          {
            name: "outbound",
            type: "boolean",
            default: false,
          },
          {
            name: "description",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "NOW()",
          },
          {
            name: "updatedAt",
            type: "timestamp",
            default: "NOW()",
          },
        ],
      })
    );
    await queryRunner.createForeignKey(
      "itemTransactions",
      new TableForeignKey({
        columnNames: ["itemId"],
        referencedTableName: "items",
        referencedColumnNames: ["id"],
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      })
    );
  }
}
