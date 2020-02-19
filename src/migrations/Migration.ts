import { connection } from '../database/config';
import * as NodeDebug from 'debug';
import { IConnection, ISchema, Attribute } from 'src/types/Model';

const debug = NodeDebug('database');

export default class Migration {
  connection: IConnection;
  tables: ISchema[];
  createQuery: string;

  constructor(tableSchemas) {
    this.tables = tableSchemas;
    this.connection = connection;

    this.prepareCreateQuery();
  }

  async dropTables(): Promise<Migration> {
    let queryString = '';
    this.tables.forEach((schema) => {
      const query = `DROP TABLE IF EXISTS ${schema.tableName};`;
      queryString += query;
    });

    const result = await this.connection.query(queryString);

    debug('tables reset result::', result);
    return this;
  }

  async createTables(query: string = this.createQuery): Promise<Migration> {
    const result = await this.connection.query(query);

    debug('tables migration result::', result);
    return this;
  }

  prepareCreateQuery(): string {
    let queryString = '';
    this.tables.forEach((schema, index) => {
      const query = `CREATE TABLE IF NOT EXISTS ${schema.tableName} (
        ${this.prepareAllFields(schema.attributes)}
      )`;
      queryString += query;
      // if the attribute is not the last one, add semi-colon to show end of query
      // so that other queries that be added
      if (index !== this.tables.length - 1) {
        queryString += '; \n';
      }
    });
    this.createQuery = queryString;
    return queryString;
  }

  prepareEachField(attribute: Attribute): string {
    let fieldRow = `"${attribute.name}"`;
    if (attribute.type === 'integer') {
      fieldRow += ' integer ';
    }
    if (attribute.type === 'string') {
      fieldRow += ` varchar(${attribute.length}) `;
    }
    if (attribute.type === 'text') {
      fieldRow += ' TEXT ';
    }
    if (attribute.type === 'timestamp') {
      fieldRow += ' timestamptz ';
    }
    if (attribute.type === 'boolean') {
      fieldRow += ' BOOLEAN ';
    }
    if (attribute.autoIncrement !== undefined) {
      fieldRow += ' SERIAL ';
    }
    if (attribute.primaryKey === true) {
      fieldRow += ' PRIMARY KEY ';
    }
    if (attribute.unique === true) {
      fieldRow += ' UNIQUE ';
    }
    if (attribute.references !== undefined) {
      fieldRow += ` REFERENCES ${attribute.on}(${attribute.references}) `;
    }
    if (attribute.notNull === true) {
      fieldRow += ' NOT NULL ';
    }
    if (attribute.default !== undefined) {
      if (attribute.default === 'currentTime') {
        fieldRow += ' DEFAULT CURRENT_TIMESTAMP ';
      } else {
        fieldRow += ` DEFAULT '${attribute.default}' `;
      }
    }

    return fieldRow;
  }

  /**
   * @param {Array} attributes - Array of attribute objects
   * @returns {Migration} - current instance
   */
  prepareAllFields(attributes) {
    let rows = '';
    let preparedField = '';
    attributes.forEach((attribute, index) => {
      preparedField = this.prepareEachField(attribute);
      rows += preparedField;
      // if the attribute is not the last one, add comma after it
      if (index !== attributes.length - 1) {
        rows += ', \n';
      }
    });

    return rows;
  }
}
