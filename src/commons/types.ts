import { Request, Response } from "express";

type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

interface IEntityIdentificator {
  id?: number;
  uuid?: string;
}

export type idOrUuid = RequireAtLeastOne<IEntityIdentificator, "id" | "uuid">;

export type MyContext = {
  req: Request;
  res: Response;
};
