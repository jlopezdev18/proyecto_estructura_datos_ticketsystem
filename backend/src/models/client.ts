import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from '../database.js';

class Client extends Model<InferAttributes<Client>, InferCreationAttributes<Client>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare identification: string;
  declare phone: string;
  declare email: string;
  declare priorityLevel: string;
}

Client.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: DataTypes.STRING,
  identification: DataTypes.STRING,
  phone: DataTypes.STRING,
  email: DataTypes.STRING,
  priorityLevel: DataTypes.STRING
}, { sequelize, modelName: 'Client' });

export default Client;