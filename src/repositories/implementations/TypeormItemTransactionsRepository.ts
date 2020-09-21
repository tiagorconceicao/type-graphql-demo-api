import { getRepository } from "typeorm";
import { IItemTransactionsRepository } from "../IItemTransactionsRepository";
import { Item } from "../../entities/Item";
import { ItemTransaction } from "../../entities/ItemTransaction";
import { idOrUuid } from "../../commons/types";
import { MyErrorReport } from "../../commons/responseHandler";
import { Account } from "../../entities/Account";

// In relations Typeorm only allows to query with the primary column (version "0.2.25").
// The query condition 'where: "{ account: { uuid } }" not works .
// For that reason this function needs to return the 'id' or find one account with the
// parameters to return the id.
// TODO: Look for better solutions
const getAccountId = async (ids: idOrUuid): Promise<number> => {
  if (ids.id) return ids.id;
  const found = await getRepository(Account).findOne(ids);
  if (!found) throw new MyErrorReport([{ message: "Account not found" }]);
  return found.id;
};

const getItemtId = async (ids: idOrUuid): Promise<number> => {
  if (ids.id) return ids.id;
  const found = await getRepository(Item).findOne(ids);
  if (!found) throw new MyErrorReport([{ message: "Item not found" }]);
  return found.id;
};

export class TypeormItemTransactionsRepository implements IItemTransactionsRepository {
  async index(itemIds: idOrUuid, accountIds: idOrUuid): Promise<ItemTransaction[]> {
    const accountId = await getAccountId(accountIds);
    const id = await getItemtId(itemIds);
    return await getRepository(ItemTransaction).find({ where: { item: { id, accountId } } });
  }

  async get(id: number, itemIds: idOrUuid, accountIds: idOrUuid): Promise<ItemTransaction | null> {
    const accountId = await getAccountId(accountIds);
    const itemId = await getItemtId(itemIds);

    const found = await getRepository(ItemTransaction).findOne({
      where: { id, item: { id: itemId, accountId } },
    });
    if (!found) return null;
    return found;
  }

  async save(itemTransaction: ItemTransaction): Promise<ItemTransaction> {
    return await getRepository(ItemTransaction).save(itemTransaction);
  }

  async delete(itemTransaction: ItemTransaction): Promise<void> {
    await getRepository(ItemTransaction).delete(itemTransaction);
  }

  async amount(itemIds: idOrUuid, accountIds: idOrUuid): Promise<number> {
    const accountId = await getAccountId(accountIds);
    const id = await getItemtId(itemIds);

    const itemTransactions = await getRepository(ItemTransaction).find({
      where: { item: { id, accountId } },
    });

    let amount = 0;
    itemTransactions.forEach((transaction) => {
      if (transaction.outbound) amount -= transaction.quantity;
      else amount += transaction.quantity;
    });

    return amount;
  }
}
