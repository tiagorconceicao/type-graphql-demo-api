import { getRepository } from "typeorm";
import { IItemsRepository } from "../IItemsRepository";
import { Account } from "../../entities/Account";
import { Item } from "../../entities/Item";
import { idOrUuid } from "../../commons/types";
import { MyErrorReport } from "../../commons/responseHandler";

// In relations Typeorm only allows to query with the primary column (version "0.2.25").
// The query condition 'where: "{ account: { uuid } }" not works .
// For that reason this function needs to return the 'id' or find one account with the
// parameters to return the id.
// TODO: Look for better solutions
const getAccountId = async (accountIds: idOrUuid): Promise<number> => {
  if (accountIds.id) return accountIds.id;
  const found = await getRepository(Account).findOne(accountIds);
  if (!found) throw new MyErrorReport([{ message: "Account not found" }]);
  return found.id;
};

export class TypeormItemsRepository implements IItemsRepository {
  async index(accountIds: idOrUuid): Promise<Item[]> {
    const accountId = await getAccountId(accountIds);
    return await getRepository(Item).find({ where: { account: { id: accountId } } });
  }

  async get(ids: idOrUuid, accountIds: idOrUuid): Promise<Item | null> {
    const accountId = await getAccountId(accountIds);
    const found = await getRepository(Item).findOne({
      where: { ...ids, account: { id: accountId } },
    });
    if (!found) return null;
    return found;
  }

  async getByName(name: string, accountIds: idOrUuid): Promise<Item | null> {
    const accountId = await getAccountId(accountIds);
    const found = await getRepository(Item).findOne({
      where: { name, account: { id: accountId } },
    });
    if (!found) return null;
    return found;
  }

  async save(item: Item): Promise<Item> {
    return await getRepository(Item).save(item);
  }

  async delete(item: Item): Promise<void> {
    await getRepository(Item).delete(item);
  }
}
