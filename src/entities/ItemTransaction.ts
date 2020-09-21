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
import { Item } from "./Item";

@ObjectType()
@Entity("itemTransactions")
export class ItemTransaction {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  itemId: number;

  @Field()
  @Column()
  quantity: number;

  @Field({ defaultValue: false })
  @Column()
  outbound: boolean;

  @Field({ nullable: true })
  @Column()
  description?: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Item)
  @JoinColumn({ name: "itemId", referencedColumnName: "id" })
  item: Item;

  constructor(props: IItemTransaction) {
    Object.assign(this, props);
  }
}

interface IItemTransaction extends ICreateItemTransactionRequest {
  accountId: number;
  itemId: number;
}

export interface ICreateItemTransactionRequest {
  quantity: number;
  outbound?: boolean;
  description?: string;
}
