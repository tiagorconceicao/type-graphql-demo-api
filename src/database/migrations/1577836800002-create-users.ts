import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateUsers1577836800002 implements MigrationInterface {
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("users");
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "users",
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
          },
          {
            name: "password",
            type: "varchar",
          },
          {
            name: "cpf",
            type: "varchar",
            length: "20",
            isNullable: true,
          },
          {
            name: "cnpj",
            type: "varchar",
            length: "20",
            isNullable: true,
          },
          {
            name: "phone",
            type: "varchar",
            length: "20",
            isNullable: true,
          },
          {
            name: "phoneMobile",
            type: "varchar",
            length: "20",
            isNullable: true,
          },
          {
            name: "externalReference",
            type: "varchar",
            length: "20",
            isNullable: true,
          },
          {
            name: "type",
            type: "tinyint",
            length: "1",
            default: 0,
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
    await queryRunner.createForeignKey(
      "users",
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
