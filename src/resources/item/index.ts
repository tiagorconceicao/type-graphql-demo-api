import { TypeormAccountsRepository } from "../../repositories/implementations/TypeormAccountsRepository";
import { TypeormItemsRepository } from "../../repositories/implementations/TypeormItemsRepository";
import { TypeormItemTransactionsRepository } from "../../repositories/implementations/TypeormItemTransactionsRepository";
import {
  CreateItemResource,
  DeleteItemResource,
  GetItemResource,
  IndexItemResource,
  UpdateItemResource,
  GetItemTransactionsResource,
  AddItemTransactionResource,
  GetItemAmountResource,
} from "./item.resources";

const typeormAccountsRepository = new TypeormAccountsRepository();
const typeormItemsRepository = new TypeormItemsRepository();
const typeormItemTransactionsRepository = new TypeormItemTransactionsRepository();

export const indexItemResource = new IndexItemResource(typeormItemsRepository);
export const getItemResource = new GetItemResource(typeormItemsRepository);
export const createItemResource = new CreateItemResource(
  typeormAccountsRepository,
  typeormItemsRepository
);
export const updateItemResource = new UpdateItemResource(typeormItemsRepository);
export const deleteItemResource = new DeleteItemResource(typeormItemsRepository);

export const getItemTransactionsResource = new GetItemTransactionsResource(
  typeormItemTransactionsRepository
);
export const addItemTransactionResource = new AddItemTransactionResource(
  typeormItemsRepository,
  typeormItemTransactionsRepository
);
export const getItemAmountResource = new GetItemAmountResource(typeormItemTransactionsRepository);
