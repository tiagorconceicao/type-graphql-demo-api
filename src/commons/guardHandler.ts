import { Request } from "express";
import { MyErrorReport } from "./responseHandler";
import { Admin } from "../entities/Admin";
import { Account } from "../entities/Account";
import { User } from "../entities/User";

export type AdminSessionGuard = {
  id: number;
  uuid: string;
};

export type AccountSessionGuard = {
  id: number;
  uuid: string;
};

export type UserSessionGuard = {
  id: number;
  uuid: string;
  accountId: number;
};

export type SessionGuards = {
  admin?: AdminSessionGuard;
  account?: AccountSessionGuard;
  user?: UserSessionGuard;
};

export const getAdminSessionGuard = (req: Request): AdminSessionGuard => {
  if (!req.session!.admin) {
    throw new MyErrorReport([{ message: "Access denied!", code: "401" }]);
  }
  return req.session!.admin;
};

export const isAdminSessionGuardAlreadySetted = (req: Request): void => {
  if (req.session!.admin) {
    throw new MyErrorReport([{ message: "Already logged as Admin!", code: "404" }]);
  }
};

export const setAdminSessionGuard = (req: Request, admin: Admin): void => {
  try {
    const adminGuard: AdminSessionGuard = {
      id: admin.id,
      uuid: admin.uuid,
    };
    req.session!.admin = adminGuard;
  } catch {
    throw new MyErrorReport([{ message: "Unexpected error", code: "500" }]);
  }
};

export const getAccountSessionGuard = (req: Request): AccountSessionGuard => {
  if (!req.session!.account) {
    throw new MyErrorReport([{ message: "Access denied!", code: "401" }]);
  }
  return req.session!.account;
};

export const isAccountSessionGuardAlreadySetted = (req: Request): void => {
  if (req.session!.account) {
    throw new MyErrorReport([{ message: "Already logged as Account!", code: "404" }]);
  }
};

export const setAccountSessionGuard = (req: Request, account: Account): void => {
  try {
    const accountGuard: AccountSessionGuard = {
      id: account.id,
      uuid: account.uuid,
    };
    req.session!.account = accountGuard;
  } catch {
    throw new MyErrorReport([{ message: "Unexpected error", code: "500" }]);
  }
};

export const getUserSessionGuard = (req: Request): UserSessionGuard => {
  if (!req.session!.user) {
    throw new MyErrorReport([{ message: "Access denied!", code: "401" }]);
  }
  return req.session!.user;
};

export const isUserSessionGuardAlreadySetted = (req: Request): void => {
  if (req.session!.user) {
    throw new MyErrorReport([{ message: "Already logged as User!", code: "404" }]);
  }
};

export const setUserSessionGuard = (req: Request, user: User): void => {
  try {
    const userGuard: UserSessionGuard = {
      id: user.id,
      uuid: user.uuid,
      accountId: user.accountId,
    };
    req.session!.user = userGuard;
  } catch {
    throw new MyErrorReport([{ message: "Unexpected error", code: "500" }]);
  }
};
