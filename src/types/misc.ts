import { IUserAttributes } from "dist/types/Model";

export interface IRefreshedTokens {
  [token: string]: {
    userId: string;
    refreshedAt: Date;
  };
}

export interface IUserAuthData {
  token?: string;
  userId?: string;
}

export type IUserResponse = IUserAttributes & IUserAuthData;
