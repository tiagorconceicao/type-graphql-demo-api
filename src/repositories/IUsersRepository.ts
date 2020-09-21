import { idOrUuid } from "../commons/types";
import { User } from "../entities/User";

export interface IUsersRepository {
  index(accountIds: idOrUuid): Promise<User[]>;

  get(ids: idOrUuid, accountIds: idOrUuid): Promise<User | null>;

  getByEmail(email: string, accountIds: idOrUuid): Promise<User | null>;

  save(user: User): Promise<User>;

  delete(user: User): Promise<void>;

  findByCpf(cpf: string, accountIds: idOrUuid): Promise<User[]>;

  findByCnpj(cnpj: string, accountIds: idOrUuid): Promise<User[]>;

  findByExternalReference(externalReference: string, accountIds: idOrUuid): Promise<User[]>;
}
