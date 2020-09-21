import { ClassType, createUnionType, Field, ObjectType } from "type-graphql";

/**
 * Errors
 */

interface IOneErrorField {
  message: string;
  code?: string;
  field?: boolean;
}

@ObjectType()
export class OneErrorField {
  constructor(params: IOneErrorField) {
    Object.assign(this, params);
  }
  @Field()
  message: string;
  @Field({ nullable: true })
  code?: string;
  @Field({ nullable: true })
  field?: string;
}

export class MyErrorReport extends Error {
  public list: OneErrorField[];
  constructor(errors: OneErrorField[]) {
    super();
    this.list = errors;
  }
}

/**
 * Mount response template
 */

export function MultiElemResponse<TItem>(TItemClass: ClassType<TItem>) {
  @ObjectType({ isAbstract: true })
  abstract class MultiItemResponseClass {
    @Field(() => [TItemClass], { nullable: true })
    data?: TItem[];

    @Field(() => [OneErrorField], { nullable: true })
    errors?: OneErrorField[];
  }
  return MultiItemResponseClass;
}

export function OneElemResponse<TItem>(TItemClass: ClassType<TItem>) {
  @ObjectType({ isAbstract: true })
  abstract class OneItemResponseClass {
    @Field(() => TItemClass, { nullable: true })
    data?: TItem;

    @Field(() => [OneErrorField], { nullable: true })
    errors?: OneErrorField[];
  }
  return OneItemResponseClass;
}

export function ResultList<TItem>(TItemClass: ClassType<TItem>) {
  @ObjectType({ isAbstract: true })
  abstract class ListClass {
    @Field(() => [TItemClass], { nullable: true })
    list: TItem[];
  }
  return ListClass;
}

/**
 * Success response
 */

@ObjectType()
class SuccessField {
  @Field()
  success: boolean;
}

@ObjectType()
export class SuccessResponse {
  @Field(() => [OneErrorField], { nullable: true })
  errors?: OneErrorField[];
  @Field(() => SuccessField, { nullable: true })
  data?: SuccessField;
}

// =======================================================================================================================

@ObjectType()
export class ErrorResult {
  @Field(() => [OneErrorField])
  errors: OneErrorField[];
}

@ObjectType()
export class SuccessResult {
  @Field()
  success: boolean;
}

export const SuccessResultUnion = createUnionType({
  name: "SuccessResultUnion",
  types: () => [SuccessResult, ErrorResult] as const,
  resolveType: (value) => {
    if ("errors" in value) return ErrorResult;
    else return SuccessResult;
  },
});
