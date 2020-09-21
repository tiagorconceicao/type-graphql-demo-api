import { v4 } from "uuid";
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { User } from "./User";
import { Item } from "./Item";

@ObjectType()
@Entity("accounts")
export class Account {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Field({ name: "id" })
  @Column()
  uuid: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  email: string;

  @Column()
  password: string;

  @Field()
  @Column({ unique: true })
  slug: string;

  @Field()
  @Column({ default: true })
  isActive: boolean;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => User, (user) => user.account, { lazy: true })
  users: Promise<User[]>;

  @OneToMany(() => Item, (item) => item.account, { lazy: true })
  items: Promise<Item[]>;

  constructor(props: ICreateAccount, uuid?: string) {
    Object.assign(this, props);
    if (!uuid) this.uuid = v4();
  }
}

interface ICreateAccount extends ICreateAccountRequest {}

export interface ICreateAccountRequest {
  name: string;
  email: string;
  password: string;
  slug: string;
  isActive?: boolean;
}

export interface IUpdateAccountRequest {
  name?: string;
  email?: string;
  password?: string;
  slug?: string;
  isActive?: boolean;
}
