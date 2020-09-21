import { getRepository } from "typeorm";
import { IAccountsRepository } from "../IAccountsRepository";
import { Account } from "../../entities/Account";
import { idOrUuid } from "../../commons/types";

export class TypeormAccountsRepository implements IAccountsRepository {
  async index(): Promise<Account[]> {
    return await getRepository(Account).find();
  }

  async get(ids: idOrUuid): Promise<Account | null> {
    const found = await getRepository(Account).findOne(ids);
    if (!found) return null;
    return found;
  }

  async getBySlug(slug: string): Promise<Account | null> {
    const found = await getRepository(Account).findOne({ slug });
    if (!found) return null;
    return found;
  }

  async getByEmail(email: string): Promise<Account | null> {
    const found = await getRepository(Account).findOne({ email });
    if (!found) return null;
    return found;
  }

  async save(account: Account): Promise<Account> {
    return await getRepository(Account).save(account);
  }

  async delete(account: Account): Promise<void> {
    await getRepository(Account).delete(account);
  }
}
