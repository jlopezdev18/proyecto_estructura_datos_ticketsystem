import { Router } from 'express';
import { rootController } from '../controllers/rootControllers.js';

export const rootRoutes = Router();

rootRoutes.get('/', rootController);