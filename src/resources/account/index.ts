import { TypeormAccountsRepository } from "../../repositories/implementations/TypeormAccountsRepository";
import {
  IndexAccountResource,
  GetAccountResource,
  CreateAccountResource,
  UpdateAccountResource,
  DeleteAccountResource,
} from "./account.resources";

const typeormAccountsRepository = new TypeormAccountsRepository();

export const indexAccountResource = new IndexAccountResource(typeormAccountsRepository);
export const getAccountResource = new GetAccountResource(typeormAccountsRepository);
export const createAccountResource = new CreateAccountResource(typeormAccountsRepository);
export const updateAccountResource = new UpdateAccountResource(typeormAccountsRepository);
export const deleteAccountResource = new DeleteAccountResource(typeormAccountsRepository);
