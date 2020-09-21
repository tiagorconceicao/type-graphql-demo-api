import { TypeormAdminsRepository } from "../../repositories/implementations/TypeormAdminsRepository";
import { TypeormAccountsRepository } from "../../repositories/implementations/TypeormAccountsRepository";
import { AuthAdminResource, AuthAccountResource } from "./auth.resources";

const typeormAdminsRepository = new TypeormAdminsRepository();
const typeormAccountsRepository = new TypeormAccountsRepository();

export const authAdminResource = new AuthAdminResource(typeormAdminsRepository);
export const authAccountResource = new AuthAccountResource(typeormAccountsRepository);
