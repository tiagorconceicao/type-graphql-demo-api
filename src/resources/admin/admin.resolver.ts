import { Resolver, Mutation, Arg, Query, Authorized, Args, ArgsType, Field } from "type-graphql";
import { SuccessResultUnion } from "../../commons/responseHandler";
import { ICreateAdminRequest, IUpdateAdminRequest } from "../../entities/Admin";
import {
  indexAdminResource,
  getAdminResource,
  createAdminResource,
  updateAdminResource,
  deleteAdminResource,
} from ".";
import { MultiAdminResultUnion, OneAdminResultUnion } from "./admin.dtos";

@ArgsType()
class CreateAdminArgs implements ICreateAdminRequest {
  @Field() firstName: string;
  @Field() lastName: string;
  @Field() email: string;
  @Field() password: string;
  @Field({ nullable: true, defaultValue: true }) isActive?: boolean;
}

@ArgsType()
class UpdateAdminArgs implements IUpdateAdminRequest {
  @Field({ nullable: true }) firstName?: string;
  @Field({ nullable: true }) lastName?: string;
  @Field({ nullable: true }) email?: string;
  @Field({ nullable: true }) password?: string;
  @Field({ nullable: true }) isActive?: boolean;
}

@Resolver()
export class AdminResolver {
  @Query(() => MultiAdminResultUnion)
  @Authorized(["ADMIN"])
  async admins(): Promise<typeof MultiAdminResultUnion> {
    try {
      return { list: await indexAdminResource.run() };
    } catch (err) {
      return { errors: err.list };
    }
  }

  @Query(() => OneAdminResultUnion, { nullable: true })
  @Authorized(["ADMIN"])
  async admin(@Arg("id") uuid: string): Promise<typeof OneAdminResultUnion> {
    try {
      return await getAdminResource.run({ uuid });
    } catch (err) {
      return { errors: err.list };
    }
  }

  @Mutation(() => OneAdminResultUnion, { nullable: true })
  @Authorized(["ADMIN"])
  async createAdmin(@Args() argsData: CreateAdminArgs): Promise<typeof OneAdminResultUnion> {
    try {
      return await createAdminResource.run(argsData);
    } catch (err) {
      return { errors: err.list };
    }
  }

  @Mutation(() => OneAdminResultUnion, { nullable: true })
  @Authorized(["ADMIN"])
  async updateAdmin(
    @Arg("id") uuid: string,
    @Args() argsData: UpdateAdminArgs
  ): Promise<typeof OneAdminResultUnion> {
    try {
      return await updateAdminResource.run(argsData, { uuid });
    } catch (err) {
      return { errors: err.list };
    }
  }

  @Mutation(() => SuccessResultUnion, { nullable: true })
  @Authorized(["ADMIN"])
  async deleteAdmin(@Arg("id") uuid: string): Promise<typeof SuccessResultUnion> {
    try {
      return { success: await deleteAdminResource.run({ uuid }) };
    } catch (err) {
      return { errors: err.list };
    }
  }
}
