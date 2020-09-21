import { createUnionType, ObjectType } from "type-graphql";
import { ErrorResult, ResultList } from "../../commons/responseHandler";
import { User } from "../../entities/User";

export const OneUserResultUnion = createUnionType({
  name: "OneUserResultUnion",
  types: () => [User, ErrorResult] as const,
  resolveType: (value) => {
    if ("errors" in value) return ErrorResult;
    else return User;
  },
});

@ObjectType()
export class Users extends ResultList(User) {}

export const MultiUserResultUnion = createUnionType({
  name: "MultiUserResultUnion",
  types: () => [Users, ErrorResult] as const,
  resolveType: (value) => {
    if ("errors" in value) return ErrorResult;
    else return Users;
  },
});
