import { idOrUuid } from "../commons/types";
import { Account } from "../entities/Account";

export interface IAccountsRepository {
  index(): Promise<Account[]>;

  get(ids: idOrUuid): Promise<Account | null>;

  getBySlug(slug: string): Promise<Account | null>;

  getByEmail(email: string): Promise<Account | null>;

  save(account: Account): Promise<Account>;

  delete(account: Account): Promise<void>;
}
