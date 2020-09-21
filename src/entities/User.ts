import { v4 } from "uuid";
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { Account } from "./Account";

@ObjectType()
@Entity("users")
export class User {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Field({ name: "id" })
  @Column()
  uuid: string;

  @Column()
  accountId: number;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field()
  @Column()
  email: string;

  @Column()
  password: string;

  @Field({ nullable: true })
  @Column()
  cpf?: string;

  @Field({ nullable: true })
  @Column()
  cnpj?: string;

  @Field({ nullable: true })
  @Column()
  phone?: string;

  @Field({ nullable: true })
  @Column()
  phoneMobile?: string;

  @Field({ nullable: true })
  @Column()
  externalReference?: string;

  @Field({ defaultValue: 0 })
  @Column()
  type: number;

  @Field({ defaultValue: true })
  @Column()
  isActive: boolean;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Account)
  @JoinColumn({ name: "accountId", referencedColumnName: "id" })
  account: Account;

  constructor(props: ICreateUser, uuid?: string) {
    Object.assign(this, props);
    if (!uuid) this.uuid = v4();
  }
}

interface ICreateUser extends ICreateUserRequest {
  accountId: number;
}

export interface ICreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  cpf?: string;
  cnpj?: string;
  phone?: string;
  phoneMobile?: string;
  externalReference?: string;
  type?: number;
  isActive?: boolean;
}

export interface IUpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  cpf?: string;
  cnpj?: string;
  phone?: string;
  phoneMobile?: string;
  externalReference?: string;
  type?: number;
  isActive?: boolean;
}
