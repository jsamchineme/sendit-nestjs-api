import { Controller, Get, Param, Req } from '@nestjs/common';
import { UserService } from './user.service';
import Response from 'src/helpers/Response';
import { ParcelController } from 'src/resources/parcel/parcel.controller';
import { ParcelService } from 'src/resources/parcel/parcel.service';

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly parcelService: ParcelService,
    private readonly parcelController: ParcelController,
  ) {}

  @Get(':userId')
  async getProfile(@Req() req): Promise<object> {
    const { userId } = req.params;
    const user = await this.userService.findById(userId);
    const transitingParcels = await this.parcelService.where({ placedBy: userId, status: 'transiting' }).count();
    const deliveredParcels = await this.parcelService.where({ placedBy: userId, status: 'delivered' }).count();
    const placedParcels = await this.parcelService.where({ placedBy: userId, status: 'placed' }).count();
    const cancelledParcels = await this.parcelService.where({ placedBy: userId, status: 'cancelled' }).count();

    delete user.password;
    delete user.isAdmin;

    user.parcels = {
      transiting: transitingParcels,
      placed: placedParcels,
      delivered: deliveredParcels,
      cancelled: cancelledParcels,
    };

    return Response.success(user);
  }

  @Get(':userId/parcels')
  async getAllUserParcel(@Param() params): Promise<object> {
    return this.parcelController.listForUser(params);
  }
}
