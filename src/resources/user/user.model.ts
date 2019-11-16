import userSchema from '../../migrations/users';
import { Model } from '../../orm/Model';

export interface IUserAttributes {
  id?: string;
  username: string;
  firstname?: string;
  lastname?: string;
  othernames?: string;
  isAdmin?: boolean;
  email: string;
  password: string;
  verified?: boolean;
  registered?: string;
  updated?: string;
}

export default class User extends Model<IUserAttributes> {
  constructor(schema = userSchema) {
    super(schema);
  }
}
