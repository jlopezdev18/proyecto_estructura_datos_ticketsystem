import express from 'express';
import { getWindows, getWindowById, createWindow, updateWindow, deleteWindow } from '../controllers/windowController';
const router = express.Router();

router.get('/', getWindows);
router.get('/:id', getWindowById);
router.post('/', createWindow);
router.put('/:id', updateWindow);
router.delete('/:id', deleteWindow);

export default router;
