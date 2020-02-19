import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ParcelController } from './parcel.controller';
import { UserService } from 'src/resources/user/user.service';
import { ParcelService } from './parcel.service';
import Authentication from 'src/middlewares/Authentication';
import Roles from 'src/middlewares/Roles';
import ParcelValidator from 'src/middlewares/inputValidation/parcels';
import RequestParam from 'src/middlewares/RequestParam';

const { verifyToken } = Authentication;
const { validateParams } = RequestParam;
const { isAdmin, isParcelOwner } = Roles;

const {
  validateChangeDestination,
  validateStatus,
  validateChangeLocation,
  validateChangeStatus,
  validateCreate,
} = ParcelValidator;

@Module({
  imports: [],
  controllers: [ParcelController],
  providers: [ParcelService, UserService],
  exports: [ParcelService],
})
export class ParcelModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(verifyToken, isAdmin)
      .forRoutes({ path: 'api/v1/parcels', method: RequestMethod.GET });

    consumer
      .apply(verifyToken, validateCreate)
      .forRoutes({ path: 'api/v1/parcels', method: RequestMethod.POST });

    consumer
      .apply(validateParams, verifyToken)
      .forRoutes({ path: 'api/v1/parcels/:parcelId', method: RequestMethod.GET });

    consumer
      .apply(validateParams, verifyToken, isParcelOwner)
      .forRoutes({ path: 'api/v1/parcels/:parcelId/cancel', method: RequestMethod.PUT });

    consumer
      .apply(validateParams, verifyToken, isAdmin, validateChangeStatus)
      .forRoutes({ path: 'api/v1/parcels/:parcelId/status', method: RequestMethod.PUT });

    consumer
      .apply(validateParams, verifyToken, isParcelOwner, validateChangeDestination, validateStatus)
      .forRoutes({ path: 'api/v1/parcels/:parcelId/destination', method: RequestMethod.PUT });

    consumer
      .apply(validateParams, verifyToken, isAdmin, validateChangeLocation)
      .forRoutes({ path: 'api/v1/parcels/:parcelId/presentLocation', method: RequestMethod.PUT });
  }
}
