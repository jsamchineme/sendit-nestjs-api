import { Controller, Get, Param, Injectable, Req, Post, Put } from '@nestjs/common';
import { ParcelService } from './parcel.service';
import { UserService } from 'src/resources/user/user.service';
import Response from 'src/helpers/Response';
import ParcelEmitter, {
  PARCEL_STATUS_UPDATE,
  PARCEL_LOCATION_UPDATE,
} from 'src/helpers/events/ParcelEmitter';

@Injectable()
@Controller()
export class ParcelController {
  constructor(
    private readonly parcelService: ParcelService,
    private readonly userService: UserService,
  ) {}

  @Get('/')
  async getAllParcels(): Promise<object> {
    const parcels = await this.parcelService.getAll();
    return {
      data: parcels,
    };
  }

  async listForUser(@Param() params): Promise<object> {
    const { userId } = params;
    const user = await this.userService.findById(userId);
    const allRecords = await this.parcelService.where({ placedBy: user.id }).getAll();
    return {
      data: allRecords,
    };
  }

  @Post()
  async createParcel(@Req() req: any): Promise<object> {
    const weightCategories = {
      '5-15': '2,000',
      '16-50': '4,000',
      '51-80': '5,000',
      '81-100': '10,000',
    };
    const newParcelData = req.body;
    const userId = req.decoded.id;
    // as parcel orders are created, they are initially given a status of 'placed'
    newParcelData.status = 'placed';
    newParcelData.placedBy = userId;

    const { weight } = newParcelData;
    let cost;
    if (weight >= 5 && weight <= 15) {
      cost = `N${weightCategories['5-15']}`;
    } else if (weight >= 16 && weight <= 50) {
      cost = `N${weightCategories['16-50']}`;
    } else if (weight >= 51 && weight <= 80) {
      cost = `N${weightCategories['51-80']}`;
    } else if (weight >= 81 && weight <= 100) {
      cost = `N${weightCategories['81-100']}`;
    } else {
      cost = `N${weightCategories['81-100']}`;
    }

    newParcelData.cost = cost;
    const newParcel = await this.parcelService.create(newParcelData);

    return Response.created(newParcel);
  }

  @Get(':parcelId')
  async getOne(@Param('parcelId') parcelId): Promise<object> {
    parcelId = Number(parcelId);
    const parcel = await this.parcelService.findById(parcelId);

    if (!parcel) {
      return Response.notFound();
    }

    return Response.success(parcel);
  }

  @Put(':parcelId/cancel')
  async cancel(@Req() req): Promise<object> {
    const { parcelId } = req.params;
    const updateData = req.body;

    updateData.status = 'cancelled';
    const updatedParcel = await this.parcelService.update(parcelId, updateData);

    return Response.success(updatedParcel);
  }

  @Put(':parcelId/destination')
  async changeDestination(@Req() req): Promise<object> {
    const { parcelId } = req.params;
    const updateData = req.body;
    const updatedParcel = await this.parcelService.update(parcelId, updateData);

    return Response.success(updatedParcel);
  }

  @Put(':parcelId/presentLocation')
  async changeLocation(@Req() req): Promise<object> {
    const { parcelId } = req.params;
    const updateData = req.body;

    const updatedParcel = await this.parcelService.update(parcelId, updateData);

    ParcelEmitter.publish(PARCEL_LOCATION_UPDATE, updatedParcel);

    return Response.success(updatedParcel);
  }

  @Put(':parcelId/status')
  async changeStatus(@Req() req): Promise<object> {
    let { parcelId } = req.params;
    const updateData = req.body;
    parcelId = Number(parcelId);
    const parcel = await this.parcelService.findById(parcelId);

    if (!parcel) {
      return Response.notFound();
    }
    const updatedParcel = await this.parcelService.update(parcelId, updateData);
    ParcelEmitter.publish(PARCEL_STATUS_UPDATE, updatedParcel);

    return Response.success(updatedParcel);
  }

}
