import { TypeormAccountsRepository } from "../../repositories/implementations/TypeormAccountsRepository";
import { TypeormUsersRepository } from "../../repositories/implementations/TypeormUsersRepository";
import {
  CreateUserResource,
  DeleteUserResource,
  GetUserResource,
  IndexUserResource,
  UpdateUserResource,
} from "./user.resources";

const typeormAccountsRepository = new TypeormAccountsRepository();
const typeormUsersRepository = new TypeormUsersRepository();

export const indexUserResource = new IndexUserResource(typeormUsersRepository);
export const getUserResource = new GetUserResource(typeormUsersRepository);
export const createUserResource = new CreateUserResource(
  typeormAccountsRepository,
  typeormUsersRepository
);
export const updateUserResource = new UpdateUserResource(typeormUsersRepository);
export const deleteUserResource = new DeleteUserResource(typeormUsersRepository);
