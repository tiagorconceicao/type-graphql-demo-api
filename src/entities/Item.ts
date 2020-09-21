import { v4 } from "uuid";
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { Account } from "./Account";
import { ItemTransaction } from "./ItemTransaction";

@ObjectType()
@Entity("items")
export class Item {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Field({ name: "id" })
  @Column()
  uuid: string;

  @Column()
  accountId: number;

  @Field()
  @Column()
  name: string;

  @Field({ nullable: true })
  @Column()
  description?: string;

  @Field({ nullable: true })
  @Column()
  imageUrl?: string;

  @Field({ defaultValue: true })
  @Column()
  isAvailable: boolean;

  @Field({ defaultValue: false })
  @Column()
  isUnlimited: boolean;

  @Field({ defaultValue: true })
  @Column()
  isActive: boolean;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => ItemTransaction, (itemTransaction) => itemTransaction.item, { lazy: true })
  itemTransactions: Promise<ItemTransaction[]>;

  @ManyToOne(() => Account)
  @JoinColumn({ name: "accountId", referencedColumnName: "id" })
  account: Account;

  constructor(props: ICreateItem, uuid?: string) {
    Object.assign(this, props);
    if (!uuid) this.uuid = v4();
  }
}

interface ICreateItem extends ICreateItemRequest {
  accountId: number;
}

export interface ICreateItemRequest {
  name: string;
  description?: string;
  imageUrl?: string;
  isAvailable?: boolean;
  isUnlimited?: boolean;
  isActive?: boolean;
}

export interface IUpdateItemRequest {
  name?: string;
  description?: string;
  imageUrl?: string;
  isAvailable?: boolean;
  isUnlimited?: boolean;
  isActive?: boolean;
}
