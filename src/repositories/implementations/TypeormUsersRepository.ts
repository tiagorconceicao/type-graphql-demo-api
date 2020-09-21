import { getRepository } from "typeorm";
import { IUsersRepository } from "../IUsersRepository";
import { Account } from "../../entities/Account";
import { User } from "../../entities/User";
import { idOrUuid } from "../../commons/types";
import { MyErrorReport } from "../../commons/responseHandler";

// In relations Typeorm only allows to query with the primary column (version "0.2.25").
// The query condition 'where: "{ account: { uuid } }" not works .
// For that reason this function needs to return the 'id' or find one account with the
// parameters to return the id.
// TODO: Look for better solutions
const getAccountId = async (accountIds: idOrUuid): Promise<number> => {
  if (accountIds.id) return accountIds.id;
  const found = await getRepository(Account).findOne(accountIds);
  if (!found) throw new MyErrorReport([{ message: "Account not found" }]);
  return found.id;
};

export class TypeormUsersRepository implements IUsersRepository {
  async index(accountIds: idOrUuid): Promise<User[]> {
    const accountId = await getAccountId(accountIds);
    return await getRepository(User).find({ where: { account: { id: accountId } } });
  }

  async get(ids: idOrUuid, accountIds: idOrUuid): Promise<User | null> {
    const accountId = await getAccountId(accountIds);
    const found = await getRepository(User).findOne({
      where: { ...ids, account: { id: accountId } },
    });
    if (!found) return null;
    return found;
  }

  async getByEmail(email: string, accountIds: idOrUuid): Promise<User | null> {
    const accountId = await getAccountId(accountIds);
    const found = await getRepository(User).findOne({
      where: { email, account: { id: accountId } },
    });
    if (!found) return null;
    return found;
  }

  async save(user: User): Promise<User> {
    return await getRepository(User).save(user);
  }

  async delete(user: User): Promise<void> {
    await getRepository(User).delete(user);
  }

  async findByCpf(cpf: string, accountIds: idOrUuid): Promise<User[]> {
    const accountId = await getAccountId(accountIds);
    return await getRepository(User).find({ where: { cpf, account: { id: accountId } } });
  }

  async findByCnpj(cnpj: string, accountIds: idOrUuid): Promise<User[]> {
    const accountId = await getAccountId(accountIds);
    return await getRepository(User).find({ where: { cnpj, account: { id: accountId } } });
  }

  async findByExternalReference(externalReference: string, accountIds: idOrUuid): Promise<User[]> {
    const accountId = await getAccountId(accountIds);
    return await getRepository(User).find({
      where: { externalReference, account: { id: accountId } },
    });
  }
}
