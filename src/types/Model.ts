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
