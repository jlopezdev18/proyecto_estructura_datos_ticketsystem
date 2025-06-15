import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "../database.js";
import User from "./user.js";

class Service extends Model<
  InferAttributes<Service>,
  InferCreationAttributes<Service>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare code: string;
  declare isPriority: boolean;
  declare createdBy: number;
}

Service.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: DataTypes.STRING,
    code: DataTypes.STRING,
    isPriority: DataTypes.BOOLEAN,
    createdBy: { type: DataTypes.INTEGER, allowNull: false },
  },
  { sequelize, modelName: "Service" }
);

Service.belongsTo(User, { foreignKey: "createdBy" });
User.hasMany(Service, { foreignKey: "createdBy" });

export default Service;
