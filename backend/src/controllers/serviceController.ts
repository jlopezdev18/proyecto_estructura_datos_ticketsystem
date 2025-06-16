import {Request, Response} from 'express';
import Service from '../models/service';
import {handleError} from '../utils/errorHandler';

export const getServices = async (req: Request, res: Response): Promise<void> => {
  try {
    const services = await Service.findAll();
    res.json(services);
  } catch (error) {
    handleError(res, error);
  }
};

export const getServiceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) {
      res.status(404).json({ error: 'Service not found' });
      return;
    }
    res.json(service);
  } catch (error) {
    handleError(res, error);
  }
};

export const createService = async (req: Request, res: Response): Promise<void> => {
  try {
    const newService = await Service.create(req.body);
    res.status(201).json(newService);
  } catch (error) {
    handleError(res, error, 400);
  }
};

export const updateService = async (req: Request, res: Response): Promise<void> => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) {
      res.status(404).json({ error: 'Service not found' });
      return;
    }
    await service.update(req.body);
    res.json(service);
  } catch (error) {
    handleError(res, error, 400);
  }
};

export const deleteService = async (req: Request, res: Response): Promise<void> => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) {
      res.status(404).json({ error: 'Service not found' });
      return;
    }
    await service.destroy();
    res.json({ message: 'Service deleted' });
  } catch (error) {
    handleError(res, error);
  }
};

