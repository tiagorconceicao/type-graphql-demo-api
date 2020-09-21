import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateAdmins1577836800000 implements MigrationInterface {
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("admins");
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "admins",
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
            name: "firstName",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "lastName",
            type: "varchar",
            isNullable: true,
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
