import { IAccountsRepository } from "../../repositories/IAccountsRepository";
import { Item, ICreateItemRequest, IUpdateItemRequest } from "../../entities/Item";
import { IItemsRepository } from "../../repositories/IItemsRepository";
import { IItemTransactionsRepository } from "../../repositories/IItemTransactionsRepository";
import { MyErrorReport, OneErrorField } from "../../commons/responseHandler";
import { idOrUuid } from "../../commons/types";
import { Joi } from "express-validation";
import { ICreateItemTransactionRequest, ItemTransaction } from "../../entities/ItemTransaction";

export class IndexItemResource {
  constructor(private itemsRepository: IItemsRepository) {}
  async run(accountIds: idOrUuid) {
    return await this.itemsRepository.index(accountIds);
  }
}

export class GetItemResource {
  constructor(private itemsRepository: IItemsRepository) {}
  async run(ids: idOrUuid, accountIds: idOrUuid) {
    const found = await this.itemsRepository.get(ids, accountIds);
    if (!found) {
      throw new MyErrorReport([{ message: "Not found", code: "404", field: "id" }]);
    }
    return found;
  }
}

export class DeleteItemResource {
  constructor(private itemsRepository: IItemsRepository) {}
  async run(ids: idOrUuid, accountIds: idOrUuid) {
    const found = await this.itemsRepository.get(ids, accountIds);
    if (!found) {
      throw new MyErrorReport([{ message: "Not found", code: "404", field: "id" }]);
    }
    await this.itemsRepository.delete(found);
    const alreadyExists = await this.itemsRepository.get(ids, accountIds);
    return alreadyExists ? false : true;
  }
}

export class CreateItemResource {
  constructor(
    private accountsRepository: IAccountsRepository,
    private itemsRepository: IItemsRepository
  ) {}
  async run(data: ICreateItemRequest, accountIds: idOrUuid) {
    // Validation
    try {
      await Joi.object({
        name: Joi.string().min(1).max(255),
        description: Joi.string().min(1).max(255),
        imageUrl: Joi.string().min(1).max(255),
        isAvailable: Joi.boolean(),
        isUnlimited: Joi.boolean(),
        isActive: Joi.boolean(),
      }).validateAsync(data, { abortEarly: false });
    } catch (err) {
      let multiErrors: OneErrorField[] = [];
      err.details.forEach((obj: any) => {
        multiErrors.push({
          message: obj.message,
          field: obj.path[0],
          code: "404",
        });
      });
      throw new MyErrorReport(multiErrors);
    }

    const account = await this.accountsRepository.get(accountIds);
    if (!account) throw new MyErrorReport([{ message: "Unexpected error", code: "500" }]);

    const nameAlreadyUsed = await this.itemsRepository.getByName(data.name, accountIds);
    if (nameAlreadyUsed)
      throw new MyErrorReport([{ message: '"name" already used', code: "404", field: "name" }]);

    const created = new Item({ ...data, accountId: account.id });
    return await this.itemsRepository.save(created);
  }
}

export class UpdateItemResource {
  constructor(private itemsRepository: IItemsRepository) {}

  async run(data: IUpdateItemRequest, ids: idOrUuid, accountIds: idOrUuid) {
    // Validation
    try {
      await Joi.object({
        name: Joi.string().min(1).max(255),
        description: Joi.string().min(1).max(255).empty(""),
        imageUrl: Joi.string().min(1).max(255).empty(""),
        isAvailable: Joi.boolean(),
        isUnlimited: Joi.boolean(),
        isActive: Joi.boolean(),
      }).validateAsync(data, { abortEarly: false });
    } catch (err) {
      let multiErrors: OneErrorField[] = [];
      err.details.forEach((obj: any) => {
        multiErrors.push({
          message: obj.message,
          field: obj.path[0],
          code: "404",
        });
      });
      throw new MyErrorReport(multiErrors);
    }

    const found = await this.itemsRepository.get(ids, accountIds);
    if (!found) {
      throw new MyErrorReport([{ message: "Not found", code: "404", field: "id" }]);
    }

    if (data.name != undefined) {
      const nameAlreadyUsed = await this.itemsRepository.getByName(data.name, accountIds);
      if (nameAlreadyUsed && nameAlreadyUsed.id != found.id)
        throw new MyErrorReport([{ message: '"name" already used', code: "404", field: "name" }]);
      found.name = data.name;
    }

    if (data.isAvailable != undefined) found.isAvailable = data.isAvailable;
    if (data.isUnlimited != undefined) found.isUnlimited = data.isUnlimited;
    if (data.isActive != undefined) found.isActive = data.isActive;

    // Nullable props
    if (data.description != undefined) {
      if (data.description != "") found.description = data.description;
      else found.description = undefined;
    }
    if (data.imageUrl != undefined) {
      if (data.imageUrl != "") found.imageUrl = data.imageUrl;
      else found.imageUrl = undefined;
    }

    return await this.itemsRepository.save(found);
  }
}

/* Item Transactions */

export class GetItemAmountResource {
  constructor(private itemTransactionsRepository: IItemTransactionsRepository) {}
  async run(itemIds: idOrUuid, accountIds: idOrUuid) {
    return await this.itemTransactionsRepository.amount(itemIds, accountIds);
  }
}

export class GetItemTransactionsResource {
  constructor(private itemTransactionsRepository: IItemTransactionsRepository) {}
  async run(itemIds: idOrUuid, accountIds: idOrUuid) {
    return await this.itemTransactionsRepository.index(itemIds, accountIds);
  }
}

export class GetItemTransactionResource {
  constructor(private itemTransactionsRepository: IItemTransactionsRepository) {}
  async run(id: number, itemIds: idOrUuid, accountIds: idOrUuid) {
    return await this.itemTransactionsRepository.get(id, itemIds, accountIds);
  }
}

export class AddItemTransactionResource {
  constructor(
    private itemsRepository: IItemsRepository,
    private itemTransactionsRepository: IItemTransactionsRepository
  ) {}
  async run(data: ICreateItemTransactionRequest, itemIds: idOrUuid, accountIds: idOrUuid) {
    try {
      await Joi.object({
        quantity: Joi.number().min(0),
        description: Joi.string().max(255).empty(""),
        outbound: Joi.boolean(),
      }).validateAsync(data, { abortEarly: false });
    } catch (err) {
      let errorList: OneErrorField[] = [];
      err.details.forEach((obj: any) => {
        errorList.push({
          message: obj.message,
          field: obj.path[0],
          code: "404",
        });
      });
      throw new MyErrorReport(errorList);
    }

    const itemFound = await this.itemsRepository.get(itemIds, accountIds);
    if (!itemFound) {
      throw new MyErrorReport([{ message: "Item not found", code: "404", field: "id" }]);
    }

    if (data.description === "") data.description = undefined;

    const itemTransaction = new ItemTransaction({
      itemId: itemFound.id,
      accountId: itemFound.accountId,
      ...data,
    });

    return await this.itemTransactionsRepository.save(itemTransaction);
  }
}
