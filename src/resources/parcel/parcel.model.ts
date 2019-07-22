import parcelSchema from '../../migrations/parcels';
import { Model } from '../../orm/Model';

export default class Parcel extends Model {
  constructor(schema = parcelSchema) {
    super(schema);
  }
}
