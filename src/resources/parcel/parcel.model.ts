import parcelSchema from '../../migrations/parcels';
import { Model } from '../../orm/Model';
import { IParcelAttributes } from '../../types/Model';

export default class Parcel extends Model<IParcelAttributes> {
  constructor(schema = parcelSchema) {
    super(schema);
  }
}
