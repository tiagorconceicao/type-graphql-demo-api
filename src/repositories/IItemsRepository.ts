import { idOrUuid } from "../commons/types";
import { Item } from "../entities/Item";

export interface IItemsRepository {
  index(accountIds: idOrUuid): Promise<Item[]>;

  get(ids: idOrUuid, accountIds: idOrUuid): Promise<Item | null>;

  getByName(name: string, accountIds: idOrUuid): Promise<Item | null>;

  save(item: Item): Promise<Item>;

  delete(item: Item): Promise<void>;
}
