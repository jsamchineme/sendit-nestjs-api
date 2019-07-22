import { Module, MiddlewareConsumer, RequestMethod, NestModule } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import Authentication from '../../middlewares/Authentication';
import Roles from '../../middlewares/Roles';
import RequestParam from '../../middlewares/RequestParam';
import { ParcelService } from '../parcel/parcel.service';
import { ParcelController } from '../parcel/parcel.controller';

const { verifyToken } = Authentication;
const { validateParams } = RequestParam;
const { isRightUser } = Roles;

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, ParcelService, ParcelController],
  exports: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(validateParams, verifyToken, isRightUser)
      .forRoutes({ path: 'api/v1/users/:userId', method: RequestMethod.GET });

    consumer
      .apply(validateParams, verifyToken, isRightUser)
      .forRoutes({ path: 'api/v1/users/:userId/parcels', method: RequestMethod.GET });
  }
}
