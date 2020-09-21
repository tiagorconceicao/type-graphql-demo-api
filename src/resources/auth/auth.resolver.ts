import { Resolver, Mutation, Ctx, Query, Authorized, ArgsType, Field, Args } from "type-graphql";
import {
  getAdminSessionGuard,
  setAdminSessionGuard,
  getAccountSessionGuard,
  setAccountSessionGuard,
  isAdminSessionGuardAlreadySetted,
  isAccountSessionGuardAlreadySetted,
} from "../../commons/guardHandler";
import { authAdminResource, authAccountResource } from ".";
import { MyContext } from "../../commons/types";
import { getAdminResource } from "../admin";
import { getAccountResource } from "../account";
import { SuccessResultUnion } from "../../commons/responseHandler";
import { IAuthDefaultRequest } from "./auth.dtos";
import { OneAccountResultUnion } from "../account/account.dtos";
import { OneAdminResultUnion } from "../admin/admin.dtos";

@ArgsType()
class AuthDefaultArgs implements IAuthDefaultRequest {
  @Field() email: string;
  @Field() password: string;
}

@Resolver()
export class AuthResolver {
  @Query(() => OneAdminResultUnion, { nullable: true })
  @Authorized(["ADMIN"])
  async meAdmin(@Ctx() { req }: MyContext): Promise<typeof OneAdminResultUnion> {
    try {
      const { id } = getAdminSessionGuard(req);
      return await getAdminResource.run({ id });
    } catch (err) {
      return { errors: err.list };
    }
  }

  @Query(() => OneAccountResultUnion, { nullable: true })
  @Authorized(["ACCOUNT"])
  async meAccount(@Ctx() { req }: MyContext): Promise<typeof OneAccountResultUnion> {
    try {
      const { id } = getAccountSessionGuard(req);
      return await getAccountResource.run({ id });
    } catch (err) {
      return { errors: err.list };
    }
  }

  @Mutation(() => OneAdminResultUnion, { nullable: true })
  async authAdmin(
    @Args() argsData: AuthDefaultArgs,
    @Ctx() { req }: MyContext
  ): Promise<typeof OneAdminResultUnion> {
    try {
      isAdminSessionGuardAlreadySetted(req);
      const data = await authAdminResource.run(argsData);
      setAdminSessionGuard(req, data);
      return data;
    } catch (err) {
      return { errors: err.list };
    }
  }

  @Mutation(() => OneAccountResultUnion, { nullable: true })
  async authAccount(
    @Args() argsData: AuthDefaultArgs,
    @Ctx() { req }: MyContext
  ): Promise<typeof OneAccountResultUnion> {
    try {
      isAccountSessionGuardAlreadySetted(req);
      const data = await authAccountResource.run(argsData);
      setAccountSessionGuard(req, data);
      return data;
    } catch (err) {
      return { errors: err.list };
    }
  }

  @Mutation(() => SuccessResultUnion)
  async logout(@Ctx() { req, res }: MyContext): Promise<typeof SuccessResultUnion> {
    try {
      res.clearCookie("qid");
      const cookieDeleted = await new Promise((resolve) =>
        req.session!.destroy((err) => {
          if (err) resolve(false);
          else resolve(true);
        })
      );
      return { success: cookieDeleted ? true : false };
    } catch (err) {
      return { errors: err.list };
    }
  }
}
