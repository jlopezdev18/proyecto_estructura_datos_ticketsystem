import sequelize from "../database.js";
import Client from "./client.js";
import Role from "./role.js";
import Window from "./window.js";
import Service from "./service.js";
import ServiceWindow from "./serviceWindow.js";
import Ticket from "./ticket.js";
import User from "./user.js";

Window.belongsToMany(Service, {
  through: ServiceWindow,
  foreignKey: "windowId",
});
Service.belongsToMany(Window, {
  through: ServiceWindow,
  foreignKey: "serviceId",
});

export {
  sequelize,
  Role,
  User,
  Client,
  Service,
  Ticket,
  Window,
  ServiceWindow,
};
