import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateItems1577836800003 implements MigrationInterface {
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("items");
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "items",
        columns: [
          {
            name: "id",
            type: "integer",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "uuid",
            type: "varchar",
            isUnique: true,
          },
          {
            name: "accountId",
            type: "integer",
          },
          {
            name: "name",
            type: "varchar",
          },
          {
            name: "description",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "imageUrl",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "isAvailable",
            type: "boolean",
            default: false,
          },
          {
            name: "isUnlimited",
            type: "boolean",
            default: false,
          },
          {
            name: "isActive",
            type: "boolean",
            default: true,
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
      "items",
      new TableForeignKey({
        columnNames: ["accountId"],
        referencedTableName: "accounts",
        referencedColumnNames: ["id"],
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      })
    );
  }
}
