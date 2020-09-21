import { MyErrorReport } from "../../commons/responseHandler";
import { IAdminsRepository } from "../../repositories/IAdminsRepository";
import { IAccountsRepository } from "../../repositories/IAccountsRepository";
import { IAuthDefaultRequest } from "./auth.dtos";
import argon2 from "argon2";

export class AuthAdminResource {
  constructor(private adminsRepository: IAdminsRepository) {}

  async run(data: IAuthDefaultRequest) {
    const found = await this.adminsRepository.getByEmail(data.email);
    if (!found || !found.isActive) {
      throw new MyErrorReport([
        { message: "These credentials do not match our records", code: "401" },
      ]);
    }

    const valid = await argon2.verify(found.password, data.password);
    if (!valid) {
      throw new MyErrorReport([
        { message: "These credentials do not match our records", code: "401" },
      ]);
    }

    return found;
  }
}

export class AuthAccountResource {
  constructor(private accountsRepository: IAccountsRepository) {}

  async run(data: IAuthDefaultRequest) {
    const found = await this.accountsRepository.getByEmail(data.email);
    if (!found || !found.isActive) {
      throw new MyErrorReport([{ message: "Account not found", code: "401", field: "email" }]);
    }

    const valid = await argon2.verify(found.password, data.password);
    if (!valid) {
      throw new MyErrorReport([
        { message: 'Incorrect "password"', code: "401", field: "password" },
      ]);
    }

    return found;
  }
}
