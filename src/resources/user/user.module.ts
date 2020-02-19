import { Module, MiddlewareConsumer, RequestMethod, NestModule } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import Authentication from 'src/middlewares/Authentication';
import Roles from 'src/middlewares/Roles';
import RequestParam from 'src/middlewares/RequestParam';
import { ParcelService } from 'src/resources/parcel/parcel.service';
import { ParcelController } from 'src/resources/parcel/parcel.controller';

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
