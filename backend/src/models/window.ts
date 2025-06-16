import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "../database.js";
import Ticket from "./ticket.js";
// import User from "./user.js";

class Window extends Model<
  InferAttributes<Window>,
  InferCreationAttributes<Window>
> {
  declare id: CreationOptional<number>;
  declare number: number;
  // declare userId: number; // FK a Usuario
  declare currentTicketId?: number; // FK opcional a Ticket
  declare services: string;
}

Window.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    number: DataTypes.INTEGER,
    // userId: { type: DataTypes.INTEGER, allowNull: false },
    services: { type: DataTypes.STRING, allowNull: false },
    currentTicketId: { type: DataTypes.INTEGER, allowNull: true },
  },
  { sequelize, modelName: "Window" }
);

// Define asociaciones con foreignKey explícito y consistente
// Window.belongsTo(User, {
//   foreignKey: "userId",
//   onDelete: "SET NULL",
//   onUpdate: "CASCADE",
// });
// User.hasMany(Window, { foreignKey: "userId" });

Window.belongsTo(Ticket, {
  foreignKey: "currentTicketId",
  as: "currentTicket",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});
Ticket.hasMany(Window, { foreignKey: "currentTicketId" });

export default Window;
