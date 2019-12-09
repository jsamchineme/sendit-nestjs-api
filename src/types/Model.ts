export interface Attribute {
  name: string;
  autoIncrement?: true;
  primaryKey?: true;
  type?: string;
  length?: number;
  notNull?: boolean;
  unique?: boolean;
  default?: any;
  references?: string;
  on?: string;
}

/**
 * an object showing tableName and attributes of an entity
 */
export interface ISchema {
  tableName: string;
  attributes: Attribute[];
}

export interface IModel {
  schema: ISchema;
  connection: IConnection;
  whereConstraints: IwhereConstraints;
}
export interface IConnection {
  query: (queryString: string) => any;
}

export interface IwhereConstraints {
  [attribute: string]: string;
}

export interface IEntity {
  [attribute: string]: number | boolean | string | any;
}

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

export interface IUsersGroupedParcels {
  transiting: IParcelAttributes[];
  placed: IParcelAttributes[];
  delivered: IParcelAttributes[];
  cancelled: IParcelAttributes[];
}
export interface IUserAttributes {
  id?: string;
  username: string;
  firstname?: string;
  lastname?: string;
  othernames?: string;
  isAdmin?: boolean;
  email: string;
  password: string;
  verified?: boolean;
  registered?: string;
  updated?: string;
  parcels?: IUsersGroupedParcels;
}
