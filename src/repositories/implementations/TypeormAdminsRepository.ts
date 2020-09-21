import { getRepository } from "typeorm";
import { IAdminsRepository } from "../IAdminsRepository";
import { Admin } from "../../entities/Admin";
import { idOrUuid } from "../../commons/types";

export class TypeormAdminsRepository implements IAdminsRepository {
  async index(): Promise<Admin[]> {
    return await getRepository(Admin).find();
  }

  async get(ids: idOrUuid): Promise<Admin | null> {
    const found = await getRepository(Admin).findOne(ids);
    if (!found) return null;
    return found;
  }

  async getByEmail(email: string): Promise<Admin | null> {
    const found = await getRepository(Admin).findOne({ email });
    if (!found) return null;
    return found;
  }

  async save(admin: Admin): Promise<Admin> {
    return await getRepository(Admin).save(admin);
  }

  async delete(admin: Admin): Promise<void> {
    await getRepository(Admin).delete(admin);
  }
}
