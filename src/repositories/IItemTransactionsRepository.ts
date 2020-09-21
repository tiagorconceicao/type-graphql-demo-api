import { idOrUuid } from "../commons/types";
import { ItemTransaction } from "../entities/ItemTransaction";

export interface IItemTransactionsRepository {
  index(itemIds: idOrUuid, accountIds: idOrUuid): Promise<ItemTransaction[]>;

  get(id: number, itemIds: idOrUuid, accountIds: idOrUuid): Promise<ItemTransaction | null>;

  save(itemTransaction: ItemTransaction): Promise<ItemTransaction>;

  delete(itemTransaction: ItemTransaction): Promise<void>;

  amount(itemIds: idOrUuid, accountIds: idOrUuid): Promise<number>;
}
