import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "../database.js";
import Cliente from "./client.js";
import Servicio from "./service.js";

class Ticket extends Model<
  InferAttributes<Ticket>,
  InferCreationAttributes<Ticket>
> {
  declare id: CreationOptional<number>;
  declare code: string;
  declare status: string;
  declare priorityLevel: string;
  declare calledAt: Date;
  declare attendedAt: Date;
  declare finishedAt: Date;
}

Ticket.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    code: DataTypes.STRING,
    status: DataTypes.STRING,
    priorityLevel: DataTypes.STRING,
    calledAt: DataTypes.DATE,
    attendedAt: DataTypes.DATE,
    finishedAt: DataTypes.DATE,
  },
  { sequelize, modelName: "Ticket" }
);

Ticket.belongsTo(Cliente, {
  foreignKey: "clientId",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});
Ticket.belongsTo(Servicio, { foreignKey: "serviceId" });
Cliente.hasMany(Ticket, { foreignKey: "clientId" });
Servicio.hasMany(Ticket, { foreignKey: "serviceId" });

export default Ticket;
