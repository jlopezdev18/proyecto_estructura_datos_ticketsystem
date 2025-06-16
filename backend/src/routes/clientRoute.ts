import express from 'express';
import {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  getClientByIdentification
} from '../controllers/clientController';

const router = express.Router();

router.get('/', getClients);
router.get('/:id', getClientById);
router.get('/identification/:identification', getClientByIdentification);
router.post('/', createClient);
router.put('/:id', updateClient);
router.delete('/:id', deleteClient);

export default router;
