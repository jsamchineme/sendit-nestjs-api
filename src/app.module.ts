import { Module } from '@nestjs/common';
import { UserModule } from './resources/user/user.module';
import { AuthModule } from './resources/auth/auth.module';
import { ParcelModule } from './resources/parcel/parcel.module';
import { RouterModule, Routes } from 'nest-router';

const routes: Routes = [
  {
    path: '/api/v1',
    children: [
      {
        path: '/users',
        module: UserModule,
      },
      {
        path: '/auth',
        module: AuthModule,
      },
      {
        path: '/parcels',
        module: ParcelModule,
      },
    ],
  },
];

@Module({
  imports: [
    UserModule,
    AuthModule,
    ParcelModule,
    RouterModule.forRoutes(routes), // setup the routes,
  ],
})
export class AppModule {}
