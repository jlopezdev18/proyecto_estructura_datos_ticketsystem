import {Request, Response} from 'express';
import Window from '../models/window';
import {handleError} from '../utils/errorHandler';

export const getWindows = async (req: Request, res: Response): Promise<void> => {
  try {
    const windows = await Window.findAll();
    res.json(windows);
  } catch (error) {
    handleError(res, error);
  }
};

export const getWindowById = async (req: Request, res: Response): Promise<void> => {
  try {
    const window = await Window.findByPk(req.params.id);
    if (!window) {
      res.status(404).json({ error: 'Window not found' });
      return;
    }
    res.json(window);
  } catch (error) {
    handleError(res, error);
  }
};

export const createWindow = async (req: Request, res: Response): Promise<void> => {
  try {
    const newWindow = await Window.create(req.body);
    res.status(201).json(newWindow);
  } catch (error) {
    handleError(res, error, 400);
  }
};

export const updateWindow = async (req: Request, res: Response): Promise<void> => {
  try {
    const window = await Window.findByPk(req.params.id);
    if (!window) {
      res.status(404).json({ error: 'Window not found' });
      return;
    }
    await window.update(req.body);
    res.json(window);
  } catch (error) {
    handleError(res, error, 400);
  }
};

export const deleteWindow = async (req: Request, res: Response): Promise<void> => {
  try {
    const window = await Window.findByPk(req.params.id);
    if (!window) {
      res.status(404).json({ error: 'Window not found' });
      return;
    }
    await window.destroy();
    res.json({ message: 'Window deleted' });
  } catch (error) {
    handleError(res, error);
  }
};

