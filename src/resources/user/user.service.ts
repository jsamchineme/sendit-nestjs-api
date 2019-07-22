import { Injectable } from '@nestjs/common';
import UserModel from './user.model';

@Injectable()
export class UserService extends UserModel {
}
