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
  declare clientName?: string;
  declare clientIdentification: string;
  declare isPriority: boolean;
  declare isAbsent: boolean;
  declare service: string;
  declare calledAt?: Date;
  declare attendedAt?: Date;
  declare finishedAt?: Date;
  declare createdAt: CreationOptional<Date>;
}

Ticket.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    code: DataTypes.STRING,
    status: { type: DataTypes.STRING, defaultValue: 'pending' },
    clientName: DataTypes.STRING,
    clientIdentification: DataTypes.STRING,
    service: DataTypes.STRING,
    isPriority: DataTypes.BOOLEAN,
    isAbsent: { type: DataTypes.BOOLEAN, defaultValue: false },
    calledAt: DataTypes.DATE,
    attendedAt: DataTypes.DATE,
    finishedAt: DataTypes.DATE,
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { sequelize, modelName: "Ticket" }
);

Ticket.belongsTo(Cliente, {
  foreignKey: "clientId",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});
// Ticket.belongsTo(Servicio, { foreignKey: "serviceId" });
Cliente.hasMany(Ticket, { foreignKey: "clientId" });
// Servicio.hasMany(Ticket, { foreignKey: "serviceId" });

export default Ticket;
