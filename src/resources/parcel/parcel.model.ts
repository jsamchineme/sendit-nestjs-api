import parcelSchema from 'src/migrations/parcels';
import { Model } from 'src/orm/Model';

export default class Parcel extends Model {
  constructor(schema = parcelSchema) {
    super(schema);
  }
}
