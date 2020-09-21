import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateAccounts1577836800001 implements MigrationInterface {
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("accounts");
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "accounts",
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
            name: "name",
            type: "varchar",
          },
          {
            name: "email",
            type: "varchar",
            isUnique: true,
          },
          {
            name: "password",
            type: "varchar",
          },
          {
            name: "slug",
            type: "varchar",
            isUnique: true,
          },
          {
            name: "isActive",
            type: "boolean",
            default: "true",
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
  }
}
