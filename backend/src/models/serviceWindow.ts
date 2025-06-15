import { Model } from 'sequelize';
import sequelize from '../database.js';

class ServiceWindow  extends Model {}

ServiceWindow.init({}, { sequelize, modelName: 'ServiceWindow' });

export default ServiceWindow;