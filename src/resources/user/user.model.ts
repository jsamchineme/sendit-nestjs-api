import userSchema from 'src/migrations/users';
import { Model } from 'src/orm/Model';

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

export default class User extends Model {
  constructor(schema = userSchema) {
    super(schema);
  }
}
