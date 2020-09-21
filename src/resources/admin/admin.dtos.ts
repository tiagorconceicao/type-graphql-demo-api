import { createUnionType, ObjectType } from "type-graphql";
import { ErrorResult, ResultList } from "../../commons/responseHandler";
import { Admin } from "../../entities/Admin";

export const OneAdminResultUnion = createUnionType({
  name: "OneAdminResultUnion",
  types: () => [Admin, ErrorResult] as const,
  resolveType: (value) => {
    if ("errors" in value) return ErrorResult;
    else return Admin;
  },
});

@ObjectType()
export class Admins extends ResultList(Admin) {}

export const MultiAdminResultUnion = createUnionType({
  name: "MultiAdminResultUnion",
  types: () => [Admins, ErrorResult] as const,
  resolveType: (value) => {
    if ("errors" in value) return ErrorResult;
    else return Admins;
  },
});
