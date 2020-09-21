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
import { ICreateItemRequest, IUpdateItemRequest } from "../../entities/Item";
import { MyContext } from "../../commons/types";
import {
  ItemAmountResultUnion,
  MultiItemResultUnion,
  MultiItemTransactionResultUnion,
  OneItemResultUnion,
  OneItemTransactionResultUnion,
} from "./item.dtos";
import {
  addItemTransactionResource,
  createItemResource,
  deleteItemResource,
  getItemAmountResource,
  getItemResource,
  getItemTransactionsResource,
  indexItemResource,
  updateItemResource,
} from ".";
import { ICreateItemTransactionRequest } from "../../entities/ItemTransaction";

@ArgsType()
class CreateItemArgs implements ICreateItemRequest {
  @Field() name: string;
  @Field({ nullable: true }) description?: string;
  @Field({ nullable: true }) imageUrl?: string;
  @Field({ nullable: true, defaultValue: true }) isAvailable?: boolean;
  @Field({ nullable: true, defaultValue: false }) isUnlimited?: boolean;
  @Field({ nullable: true, defaultValue: true }) isActive?: boolean;
}

@ArgsType()
class UpdateItemArgs implements IUpdateItemRequest {
  @Field({ nullable: true }) name?: string;
  @Field({ nullable: true }) description?: string;
  @Field({ nullable: true }) imageUrl?: string;
  @Field({ nullable: true }) isAvailable?: boolean;
  @Field({ nullable: true }) isUnlimited?: boolean;
  @Field({ nullable: true }) isActive?: boolean;
}

@ArgsType()
class AddItemTransactionArgs implements ICreateItemTransactionRequest {
  @Field() quantity: number;
  @Field({ nullable: true }) description?: string;
  @Field({ nullable: true, defaultValue: false }) outbound?: boolean;
}

@Resolver()
export class ItemResolver {
  @Query(() => MultiItemResultUnion, { nullable: true })
  @Authorized(["ACCOUNT"])
  async items(@Ctx() { req }: MyContext): Promise<typeof MultiItemResultUnion> {
    try {
      const accountIds = getAccountSessionGuard(req);
      return { list: await indexItemResource.run({ id: accountIds.id }) };
    } catch (err) {
      return { errors: err.list };
    }
  }

  @Query(() => OneItemResultUnion, { nullable: true })
  @Authorized(["ACCOUNT"])
  async item(
    @Arg("id") uuid: string,
    @Ctx() { req }: MyContext
  ): Promise<typeof OneItemResultUnion> {
    try {
      const accountIds = getAccountSessionGuard(req);
      return await getItemResource.run({ uuid }, { id: accountIds.id });
    } catch (err) {
      return { errors: err.list };
    }
  }

  @Mutation(() => OneItemResultUnion, { nullable: true })
  @Authorized(["ACCOUNT"])
  async createItem(
    @Args() argsData: CreateItemArgs,
    @Ctx() { req }: MyContext
  ): Promise<typeof OneItemResultUnion> {
    try {
      const { id } = getAccountSessionGuard(req);
      return await createItemResource.run(argsData, { id });
    } catch (err) {
      return { errors: err.list };
    }
  }

  @Mutation(() => OneItemResultUnion, { nullable: true })
  @Authorized(["ACCOUNT"])
  async updateItem(
    @Arg("id") uuid: string,
    @Args() argsData: UpdateItemArgs,
    @Ctx() { req }: MyContext
  ): Promise<typeof OneItemResultUnion> {
    try {
      const { id } = getAccountSessionGuard(req);
      return await updateItemResource.run(argsData, { uuid }, { id });
    } catch (err) {
      return { errors: err.list };
    }
  }

  @Mutation(() => SuccessResultUnion, { nullable: true })
  @Authorized(["ACCOUNT"])
  async deleteItem(
    @Arg("id") uuid: string,
    @Ctx() { req }: MyContext
  ): Promise<typeof SuccessResultUnion> {
    try {
      const { id } = getAccountSessionGuard(req);
      return { success: await deleteItemResource.run({ uuid }, { id }) };
    } catch (err) {
      return { errors: err.list };
    }
  }

  @Query(() => ItemAmountResultUnion, { nullable: true })
  @Authorized(["ACCOUNT"])
  async itemAmount(
    @Arg("id") uuid: string,
    @Ctx() { req }: MyContext
  ): Promise<typeof ItemAmountResultUnion> {
    try {
      const { id } = getAccountSessionGuard(req);
      return { amount: await getItemAmountResource.run({ uuid }, { id }) };
    } catch (err) {
      return { errors: err.list };
    }
  }

  @Query(() => MultiItemTransactionResultUnion, { nullable: true })
  @Authorized(["ACCOUNT"])
  async itemTransactions(
    @Arg("id") uuid: string,
    @Ctx() { req }: MyContext
  ): Promise<typeof MultiItemTransactionResultUnion> {
    try {
      const { id } = getAccountSessionGuard(req);
      return { list: await getItemTransactionsResource.run({ uuid }, { id }) };
    } catch (err) {
      return { errors: err.list };
    }
  }

  @Mutation(() => OneItemTransactionResultUnion, { nullable: true })
  @Authorized(["ACCOUNT"])
  async additemTransaction(
    @Arg("id") uuid: string,
    @Args() argsData: AddItemTransactionArgs,
    @Ctx() { req }: MyContext
  ): Promise<typeof OneItemTransactionResultUnion> {
    try {
      const { id } = getAccountSessionGuard(req);
      return await addItemTransactionResource.run(argsData, { uuid }, { id });
    } catch (err) {
      return { errors: err.list };
    }
  }
}
