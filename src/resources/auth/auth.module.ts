import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import AuthValidator from '../../middlewares/inputValidation/auth';
import Authentication from '../../middlewares/Authentication';
import Roles from '../../middlewares/Roles';

const { verifyToken } = Authentication;
const { validateLogin, validateSignup, validateUnique } = AuthValidator;
const { isAdmin } = Roles;

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  exports: [],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(validateSignup, validateUnique)
      .forRoutes('api/v1/auth/signup');

    consumer
      .apply(validateLogin)
      .forRoutes('api/v1/auth/login');

    consumer
      .apply(verifyToken, isAdmin)
      .forRoutes({ path: '/users/:userId', method: RequestMethod.DELETE });

    consumer
      .apply(verifyToken)
      .forRoutes({ path: 'refresh', method: RequestMethod.PATCH });

    consumer
      .apply(verifyToken)
      .forRoutes({ path: 'reset', method: RequestMethod.PUT });
  }
}
