import { Resolver, Mutation, Arg, Query, Authorized, ArgsType, Field, Args } from "type-graphql";
import { SuccessResultUnion } from "../../commons/responseHandler";
import { ICreateAccountRequest, IUpdateAccountRequest } from "../../entities/Account";
import { MultiAccountResultUnion, OneAccountResultUnion } from "./account.dtos";
import {
  indexAccountResource,
  getAccountResource,
  createAccountResource,
  updateAccountResource,
  deleteAccountResource,
} from ".";

@ArgsType()
class CreateAccountArgs implements ICreateAccountRequest {
  @Field() name: string;
  @Field() email: string;
  @Field() password: string;
  @Field() slug: string;
  @Field({ nullable: true, defaultValue: true }) isActive?: boolean;
}

@ArgsType()
class UpdateAccountArgs implements IUpdateAccountRequest {
  @Field({ nullable: true }) name?: string;
  @Field({ nullable: true }) email?: string;
  @Field({ nullable: true }) password?: string;
  @Field({ nullable: true }) slug?: string;
  @Field({ nullable: true }) isActive?: boolean;
}

@Resolver()
export class AccountResolver {
  @Query(() => MultiAccountResultUnion)
  @Authorized(["ADMIN"])
  async accounts(): Promise<typeof MultiAccountResultUnion> {
    try {
      return { list: await indexAccountResource.run() };
    } catch (err) {
      return { errors: err.list };
    }
  }

  @Query(() => OneAccountResultUnion, { nullable: true })
  @Authorized(["ADMIN"])
  async account(@Arg("id") uuid: string): Promise<typeof OneAccountResultUnion> {
    try {
      return await getAccountResource.run({ uuid });
    } catch (err) {
      return { errors: err.list };
    }
  }

  @Mutation(() => OneAccountResultUnion, { nullable: true })
  @Authorized(["ADMIN"])
  async createAccount(@Args() argsData: CreateAccountArgs): Promise<typeof OneAccountResultUnion> {
    try {
      return await createAccountResource.run(argsData);
    } catch (err) {
      return { errors: err.list };
    }
  }

  @Mutation(() => OneAccountResultUnion, { nullable: true })
  @Authorized(["ADMIN"])
  async updateAccount(
    @Arg("id") uuid: string,
    @Args() argsData: UpdateAccountArgs
  ): Promise<typeof OneAccountResultUnion> {
    try {
      return await updateAccountResource.run(argsData, { uuid });
    } catch (err) {
      return { errors: err.list };
    }
  }

  @Mutation(() => SuccessResultUnion, { nullable: true })
  @Authorized(["ADMIN"])
  async deleteAccount(@Arg("id") uuid: string): Promise<typeof SuccessResultUnion> {
    try {
      return { success: await deleteAccountResource.run({ uuid }) };
    } catch (err) {
      return { errors: err.list };
    }
  }
}
