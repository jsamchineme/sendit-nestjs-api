import userSchema from '../../migrations/users';
import { Model } from '../../orm/Model';
import { IUserAttributes } from '../../types/Model';
export default class User extends Model<IUserAttributes> {
  constructor(schema = userSchema) {
    super(schema);
  }
}
