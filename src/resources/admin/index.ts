import { TypeormAdminsRepository } from "../../repositories/implementations/TypeormAdminsRepository";
import {
  IndexAdminResource,
  GetAdminResource,
  CreateAdminResource,
  UpdateAdminResource,
  DeleteAdminResource,
} from "./admin.resources";

const typeormAdminsRepository = new TypeormAdminsRepository();

export const indexAdminResource = new IndexAdminResource(typeormAdminsRepository);
export const getAdminResource = new GetAdminResource(typeormAdminsRepository);
export const createAdminResource = new CreateAdminResource(typeormAdminsRepository);
export const updateAdminResource = new UpdateAdminResource(typeormAdminsRepository);
export const deleteAdminResource = new DeleteAdminResource(typeormAdminsRepository);
