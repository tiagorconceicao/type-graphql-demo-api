import { v4 } from "uuid";
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity("admins")
export class Admin {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Field({ name: "id" })
  @Column()
  uuid: string;

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

  @Field()
  @Column({ default: true })
  isActive: boolean;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  constructor(props: ICreateAdmin, uuid?: string) {
    Object.assign(this, props);
    if (!uuid) this.uuid = v4();
  }
}

interface ICreateAdmin extends ICreateAdminRequest {}

export interface ICreateAdminRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isActive?: boolean;
}

export interface IUpdateAdminRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  isActive?: boolean;
}
