import { Injectable } from '@nestjs/common';
import ParcelModel from './parcel.model';

@Injectable()
export class ParcelService extends ParcelModel {
}
