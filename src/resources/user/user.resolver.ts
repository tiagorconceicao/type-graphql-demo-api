import {
  Resolver,
  Mutation,
  Arg,
  Query,
  Authorized,
  Ctx,
  ArgsType,
  Field,
  Args,
} from "type-graphql";
import { getAccountSessionGuard } from "../../commons/guardHandler";
import { SuccessResultUnion } from "../../commons/responseHandler";
import { ICreateUserRequest, IUpdateUserRequest } from "../../entities/User";
import { MyContext } from "../../commons/types";
import {
  createUserResource,
  deleteUserResource,
  getUserResource,
  indexUserResource,
  updateUserResource,
} from ".";
import { MultiUserResultUnion, OneUserResultUnion } from "./user.dtos";

@ArgsType()
class CreateUserArgs implements ICreateUserRequest {
  @Field() firstName: string;
  @Field() lastName: string;
  @Field() email: string;
  @Field() password: string;
  @Field({ nullable: true }) cpf?: string;
  @Field({ nullable: true }) cnpj?: string;
  @Field({ nullable: true }) phone?: string;
  @Field({ nullable: true }) phoneMobile?: string;
  @Field({ nullable: true }) externalReference?: string;
  @Field({ nullable: true, defaultValue: 0 }) type?: number;
  @Field({ nullable: true, defaultValue: true }) isActive?: boolean;
}

@ArgsType()
class UpdateUserArgs implements IUpdateUserRequest {
  @Field({ nullable: true }) firstName?: string;
  @Field({ nullable: true }) lastName?: string;
  @Field({ nullable: true }) email?: string;
  @Field({ nullable: true }) password?: string;
  @Field({ nullable: true }) cpf?: string;
  @Field({ nullable: true }) cnpj?: string;
  @Field({ nullable: true }) phone?: string;
  @Field({ nullable: true }) phoneMobile?: string;
  @Field({ nullable: true }) externalReference?: string;
  @Field({ nullable: true }) type?: number;
  @Field({ nullable: true }) isActive?: boolean;
}

@Resolver()
export class UserResolver {
  @Query(() => MultiUserResultUnion, { nullable: true })
  @Authorized(["ACCOUNT"])
  async users(@Ctx() { req }: MyContext): Promise<typeof MultiUserResultUnion> {
    try {
      const accountIds = getAccountSessionGuard(req);
      return { list: await indexUserResource.run({ id: accountIds.id }) };
    } catch (err) {
      return { errors: err.list };
    }
  }

  @Query(() => OneUserResultUnion, { nullable: true })
  @Authorized(["ACCOUNT"])
  async user(
    @Arg("id") uuid: string,
    @Ctx() { req }: MyContext
  ): Promise<typeof OneUserResultUnion> {
    try {
      const accountIds = getAccountSessionGuard(req);
      return await getUserResource.run({ uuid }, { id: accountIds.id });
    } catch (err) {
      return { errors: err.list };
    }
  }

  @Mutation(() => OneUserResultUnion, { nullable: true })
  @Authorized(["ACCOUNT"])
  async createUser(
    @Args() argsData: CreateUserArgs,
    @Ctx() { req }: MyContext
  ): Promise<typeof OneUserResultUnion> {
    try {
      const { id } = getAccountSessionGuard(req);
      return await createUserResource.run(argsData, { id });
    } catch (err) {
      return { errors: err.list };
    }
  }

  @Mutation(() => OneUserResultUnion, { nullable: true })
  @Authorized(["ACCOUNT"])
  async updateUser(
    @Arg("id") uuid: string,
    @Args() argsData: UpdateUserArgs,
    @Ctx() { req }: MyContext
  ): Promise<typeof OneUserResultUnion> {
    try {
      const { id } = getAccountSessionGuard(req);
      return await updateUserResource.run(argsData, { uuid }, { id });
    } catch (err) {
      return { errors: err.list };
    }
  }

  @Mutation(() => SuccessResultUnion, { nullable: true })
  @Authorized(["ACCOUNT"])
  async deleteUser(
    @Arg("id") uuid: string,
    @Ctx() { req }: MyContext
  ): Promise<typeof SuccessResultUnion> {
    try {
      const { id } = getAccountSessionGuard(req);
      return { success: await deleteUserResource.run({ uuid }, { id }) };
    } catch (err) {
      return { errors: err.list };
    }
  }
}
