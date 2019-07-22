export interface IRefreshedTokens {
  [token: string]: {
    userId: string;
    refreshedAt: Date;
  };
}
