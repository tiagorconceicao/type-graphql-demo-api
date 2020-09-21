import { idOrUuid } from "../commons/types";
import { Admin } from "../entities/Admin";

export interface IAdminsRepository {
  index(): Promise<Admin[]>;

  get(ids: idOrUuid): Promise<Admin | null>;

  getByEmail(email: string): Promise<Admin | null>;

  save(admin: Admin): Promise<Admin>;

  delete(admin: Admin): Promise<void>;
}
