import parcelSchema from '../../migrations/parcels';
import { Model } from '../../orm/Model';

export interface IParcelAttributes {
  id?: string;
  placedBy: string;
  description: string;
  weight: string;
  weightmetric: string;
  cost: string;
  contactPhone: string;
  contactEmail: string;
  status: string;
  currentLocation: string;
  to: string;
  from: string;
  presentMapPointer: string;
  sentOn: string;
  deliveredOn: string;
}

export default class Parcel extends Model<IParcelAttributes> {
  constructor(schema = parcelSchema) {
    super(schema);
  }
}
