import { IAccountsRepository } from "../../repositories/IAccountsRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { User, ICreateUserRequest, IUpdateUserRequest } from "../../entities/User";
import { MyErrorReport, OneErrorField } from "../../commons/responseHandler";
import { idOrUuid } from "../../commons/types";
import { Joi } from "express-validation";
import { isValidCnpj, isValidCpf } from "../../utils/joiCustomRules";
import argon2 from "argon2";

export class IndexUserResource {
  constructor(private usersRepository: IUsersRepository) {}
  async run(accountIds: idOrUuid) {
    return await this.usersRepository.index(accountIds);
  }
}

export class GetUserResource {
  constructor(private usersRepository: IUsersRepository) {}
  async run(ids: idOrUuid, accountIds: idOrUuid) {
    const found = await this.usersRepository.get(ids, accountIds);
    if (!found) {
      throw new MyErrorReport([{ message: "Not found", code: "404", field: "id" }]);
    }
    return found;
  }
}

export class DeleteUserResource {
  constructor(private usersRepository: IUsersRepository) {}
  async run(ids: idOrUuid, accountIds: idOrUuid) {
    const found = await this.usersRepository.get(ids, accountIds);
    if (!found) {
      throw new MyErrorReport([{ message: "Not found", code: "404", field: "id" }]);
    }
    await this.usersRepository.delete(found);
    const alreadyExists = await this.usersRepository.get(ids, accountIds);
    return alreadyExists ? false : true;
  }
}

export class CreateUserResource {
  constructor(
    private accountsRepository: IAccountsRepository,
    private usersRepository: IUsersRepository
  ) {}
  async run(data: ICreateUserRequest, accountIds: idOrUuid) {
    // Validation
    try {
      await Joi.object({
        firstName: Joi.string().min(1).max(255),
        lastName: Joi.string().min(1).max(255),
        email: Joi.string().email(),
        password: Joi.string().min(5).max(30),
        cpf: Joi.string().custom(isValidCpf, "cpf validation"),
        cnpj: Joi.string().custom(isValidCnpj, "cnpj validation"),
        phone: Joi.string()
          .min(10)
          .max(20)
          .pattern(/^[0-9]+$/, { name: "numeric" }),
        phoneMobile: Joi.string()
          .min(10)
          .max(20)
          .pattern(/^[0-9]+$/, { name: "numeric" }),
        externalReference: Joi.string(),
        type: Joi.number().min(0),
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

    const emailAlreadyUsed = await this.usersRepository.getByEmail(data.email, accountIds);
    if (emailAlreadyUsed)
      throw new MyErrorReport([{ message: '"email" already used', code: "404", field: "email" }]);

    data.password = await argon2.hash(data.password);
    const created = new User({ ...data, accountId: account.id });
    return await this.usersRepository.save(created);
  }
}

export class UpdateUserResource {
  constructor(private usersRepository: IUsersRepository) {}

  async run(data: IUpdateUserRequest, ids: idOrUuid, accountIds: idOrUuid) {
    // Validation
    try {
      await Joi.object({
        firstName: Joi.string().min(1).max(255),
        lastName: Joi.string().min(1).max(255),
        email: Joi.string().email(),
        password: Joi.string().min(5).max(30),
        cpf: Joi.number().custom(isValidCpf, "cpf validation").empty(""),
        cnpj: Joi.number().custom(isValidCnpj, "cnpj validation").empty(""),
        phone: Joi.string()
          .min(10)
          .max(20)
          .pattern(/^[0-9]+$/, { name: "numeric" })
          .empty(""),
        phoneMobile: Joi.string()
          .min(10)
          .max(20)
          .pattern(/^[0-9]+$/, { name: "numeric" })
          .empty(""),
        externalReference: Joi.string().empty(""),
        type: Joi.number().min(0),
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

    const found = await this.usersRepository.get(ids, accountIds);
    if (!found) {
      throw new MyErrorReport([{ message: "Not found", code: "404", field: "id" }]);
    }

    if (data.email != undefined) {
      const emailAlreadyUsed = await this.usersRepository.getByEmail(data.email, accountIds);
      if (emailAlreadyUsed && emailAlreadyUsed.id != found.id)
        throw new MyErrorReport([{ message: '"email" already used', code: "404", field: "email" }]);
      found.email = data.email;
    }

    if (data.password != undefined) found.password = await argon2.hash(data.password);
    if (data.firstName != undefined) found.firstName = data.firstName;
    if (data.lastName != undefined) found.lastName = data.lastName;
    if (data.type != undefined) found.type = data.type;
    if (data.isActive != undefined) found.isActive = data.isActive;

    // Nullable props
    if (data.cpf != undefined) {
      if (data.cpf != "") found.cpf = data.cpf.replace(/[^0-9]*/gim, "");
      else found.cpf = undefined;
    }
    if (data.cnpj != undefined) {
      if (data.cnpj != "") found.cnpj = data.cnpj.replace(/[^0-9]*/gim, "");
      else found.cnpj = undefined;
    }
    if (data.phone != undefined) {
      if (data.phone != "") found.phone = data.phone.replace(/[^0-9]*/gim, "");
      else found.phone = undefined;
    }
    if (data.phoneMobile != undefined) {
      if (data.phoneMobile != "") found.phoneMobile = data.phoneMobile.replace(/[^0-9]*/gim, "");
      else found.phoneMobile = undefined;
    }
    if (data.externalReference != undefined) {
      if (data.externalReference != "")
        found.externalReference = data.externalReference.replace(/[^0-9]*/gim, "");
      else found.externalReference = undefined;
    }

    return await this.usersRepository.save(found);
  }
}
