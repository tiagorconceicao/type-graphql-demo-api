import { createUnionType, ObjectType, Field } from "type-graphql";
import { ErrorResult, ResultList } from "../../commons/responseHandler";
import { Item } from "../../entities/Item";
import { ItemTransaction } from "../../entities/ItemTransaction";

export const OneItemResultUnion = createUnionType({
  name: "OneItemResultUnion",
  types: () => [Item, ErrorResult] as const,
  resolveType: (value) => {
    if ("errors" in value) return ErrorResult;
    else return Item;
  },
});

@ObjectType()
export class Items extends ResultList(Item) {}

export const MultiItemResultUnion = createUnionType({
  name: "MultiItemResultUnion",
  types: () => [Items, ErrorResult] as const,
  resolveType: (value) => {
    if ("errors" in value) return ErrorResult;
    else return Items;
  },
});

/* Item transactions */

@ObjectType()
class ItemAmountResult {
  @Field()
  amount: number;
}

export const ItemAmountResultUnion = createUnionType({
  name: "ItemAmountResultUnion",
  types: () => [ItemAmountResult, ErrorResult] as const,
  resolveType: (value) => {
    if ("errors" in value) return ErrorResult;
    else return ItemAmountResult;
  },
});

export const OneItemTransactionResultUnion = createUnionType({
  name: "OneItemTransactionResultUnion",
  types: () => [ItemTransaction, ErrorResult] as const,
  resolveType: (value) => {
    if ("errors" in value) return ErrorResult;
    else return ItemTransaction;
  },
});

@ObjectType()
export class ItemTransactions extends ResultList(ItemTransaction) {}

export const MultiItemTransactionResultUnion = createUnionType({
  name: "MultiItemTransactionResultUnion",
  types: () => [ItemTransactions, ErrorResult] as const,
  resolveType: (value) => {
    if ("errors" in value) return ErrorResult;
    else return ItemTransactions;
  },
});
