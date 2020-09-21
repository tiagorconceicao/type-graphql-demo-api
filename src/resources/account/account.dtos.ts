import { createUnionType, ObjectType } from "type-graphql";
import { ErrorResult, ResultList } from "../../commons/responseHandler";
import { Account } from "../../entities/Account";

export const OneAccountResultUnion = createUnionType({
  name: "OneAccountResultUnion",
  types: () => [Account, ErrorResult] as const,
  resolveType: (value) => {
    if ("errors" in value) return ErrorResult;
    else return Account;
  },
});

@ObjectType()
export class Accounts extends ResultList(Account) {}

export const MultiAccountResultUnion = createUnionType({
  name: "MultiAccountResultUnion",
  types: () => [Accounts, ErrorResult] as const,
  resolveType: (value) => {
    if ("errors" in value) return ErrorResult;
    else return Accounts;
  },
});
