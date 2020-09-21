import { IAccountsRepository } from "../../repositories/IAccountsRepository";
import { Account, ICreateAccountRequest, IUpdateAccountRequest } from "../../entities/Account";
import { MyErrorReport, OneErrorField } from "../../commons/responseHandler";
import { idOrUuid } from "../../commons/types";
import { Joi } from "express-validation";
import argon2 from "argon2";

export class IndexAccountResource {
  constructor(private accountsRepository: IAccountsRepository) {}
  async run() {
    return await this.accountsRepository.index();
  }
}

export class GetAccountResource {
  constructor(private accountsRepository: IAccountsRepository) {}

  async run(ids: idOrUuid) {
    const found = await this.accountsRepository.get(ids);
    if (!found) {
      throw new MyErrorReport([{ message: "Not found", code: "404", field: "id" }]);
    }
    return found;
  }
}

export class DeleteAccountResource {
  constructor(private accountsRepository: IAccountsRepository) {}

  async run(ids: idOrUuid) {
    const found = await this.accountsRepository.get(ids);

    if (!found) throw new MyErrorReport([{ message: "Not found", code: "404", field: "id" }]);

    await this.accountsRepository.delete(found);

    const alreadyExists = await this.accountsRepository.get(ids);

    return alreadyExists ? false : true;
  }
}

export class CreateAccountResource {
  constructor(private accountsRepository: IAccountsRepository) {}

  async run(data: ICreateAccountRequest) {
    const { name, email, password, slug, isActive } = data;

    // Validation
    try {
      await Joi.object({
        name: Joi.string().min(4).max(255),
        email: Joi.string().email(),
        password: Joi.string().min(5).max(30),
        slug: Joi.string().min(4).max(255),
        isActive: Joi.boolean(),
      }).validateAsync({ name, email, password, slug, isActive }, { abortEarly: false });
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

    const slugAlreadyUsed = await this.accountsRepository.getBySlug(slug);
    if (slugAlreadyUsed)
      throw new MyErrorReport([{ message: '"slug" already used', code: "404", field: "slug" }]);

    const emailAlreadyUsed = await this.accountsRepository.getByEmail(email);
    if (emailAlreadyUsed)
      throw new MyErrorReport([{ message: '"email" already used', code: "404", field: "email" }]);

    data.password = await argon2.hash(data.password);

    const created = new Account(data);

    return await this.accountsRepository.save(created);
  }
}

export class UpdateAccountResource {
  constructor(private accountsRepository: IAccountsRepository) {}

  async run(data: IUpdateAccountRequest, ids: idOrUuid) {
    const { name, email, password, slug, isActive } = data;

    // Validation
    try {
      await Joi.object({
        name: Joi.string().min(4).max(255),
        email: Joi.string().email(),
        password: Joi.string().min(5).max(30),
        slug: Joi.string().min(4).max(255),
        isActive: Joi.boolean(),
      }).validateAsync({ name, email, password, slug, isActive }, { abortEarly: false });
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

    const found = await this.accountsRepository.get(ids);
    if (!found) {
      throw new MyErrorReport([{ message: "Not found", code: "404", field: "id" }]);
    }

    if (slug != undefined) {
      const slugAlreadyUsed = await this.accountsRepository.getBySlug(slug);
      if (slugAlreadyUsed && slugAlreadyUsed.id != found.id)
        throw new MyErrorReport([{ message: '"slug" already used', code: "404", field: "slug" }]);
      found.slug = slug;
    }

    if (email != undefined) {
      const emailAlreadyUsed = await this.accountsRepository.getByEmail(email);
      if (emailAlreadyUsed && emailAlreadyUsed.id != found.id)
        throw new MyErrorReport([{ message: '"email" already used', code: "404", field: "email" }]);
      found.email = email;
    }

    if (password != undefined) found.password = await argon2.hash(password);

    if (name != undefined) found.name = name;
    if (isActive != undefined) found.isActive = isActive;

    return await this.accountsRepository.save(found);
  }
}
