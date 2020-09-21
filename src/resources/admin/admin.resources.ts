import { IAdminsRepository } from "../../repositories/IAdminsRepository";
import { Admin, ICreateAdminRequest, IUpdateAdminRequest } from "../../entities/Admin";
import { MyErrorReport, OneErrorField } from "../../commons/responseHandler";
import { idOrUuid } from "../../commons/types";
import { Joi } from "express-validation";
import argon2 from "argon2";

export class IndexAdminResource {
  constructor(private adminsRepository: IAdminsRepository) {}
  async run() {
    return await this.adminsRepository.index();
  }
}

export class GetAdminResource {
  constructor(private adminsRepository: IAdminsRepository) {}

  async run(ids: idOrUuid) {
    const found = await this.adminsRepository.get(ids);
    if (!found) {
      throw new MyErrorReport([{ message: "Not found", code: "404", field: "id" }]);
    }
    return found;
  }
}

export class DeleteAdminResource {
  constructor(private adminsRepository: IAdminsRepository) {}

  async run(ids: idOrUuid) {
    const found = await this.adminsRepository.get(ids);

    if (!found) throw new MyErrorReport([{ message: "Not found", code: "404", field: "id" }]);

    await this.adminsRepository.delete(found);

    const alreadyExists = await this.adminsRepository.get(ids);

    return alreadyExists ? false : true;
  }
}

export class CreateAdminResource {
  constructor(private adminsRepository: IAdminsRepository) {}

  async run(data: ICreateAdminRequest) {
    const { firstName, lastName, email, password, isActive } = data;

    // Validation
    try {
      await Joi.object({
        firstName: Joi.string().min(1).max(255),
        lastName: Joi.string().min(1).max(255),
        email: Joi.string().email(),
        password: Joi.string().min(5).max(30),
        isActive: Joi.boolean(),
      }).validateAsync({ firstName, lastName, email, password, isActive }, { abortEarly: false });
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

    const emailAlreadyUsed = await this.adminsRepository.getByEmail(email);
    if (emailAlreadyUsed)
      throw new MyErrorReport([{ message: '"email" already used', code: "404", field: "email" }]);

    data.password = await argon2.hash(data.password);

    const created = new Admin(data);

    return await this.adminsRepository.save(created);
  }
}

export class UpdateAdminResource {
  constructor(private adminsRepository: IAdminsRepository) {}

  async run(data: IUpdateAdminRequest, ids: idOrUuid) {
    const { firstName, lastName, email, password, isActive } = data;

    // Validation
    try {
      await Joi.object({
        firstName: Joi.string().min(1).max(255),
        lastName: Joi.string().min(1).max(255),
        email: Joi.string().email(),
        password: Joi.string().min(5).max(30),
        isActive: Joi.boolean(),
      }).validateAsync({ firstName, lastName, email, password, isActive }, { abortEarly: false });
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

    const found = await this.adminsRepository.get(ids);
    if (!found) {
      throw new MyErrorReport([{ message: "Not found", code: "404", field: "id" }]);
    }

    if (email != undefined) {
      const emailAlreadyUsed = await this.adminsRepository.getByEmail(email);
      if (emailAlreadyUsed && emailAlreadyUsed.id != found.id)
        throw new MyErrorReport([{ message: '"email" already used', code: "404", field: "email" }]);
      found.email = email;
    }

    if (password != undefined) found.password = await argon2.hash(password);
    if (firstName != undefined) found.firstName = firstName;
    if (lastName != undefined) found.lastName = lastName;
    if (isActive != undefined) found.isActive = isActive;

    return await this.adminsRepository.save(found);
  }
}
