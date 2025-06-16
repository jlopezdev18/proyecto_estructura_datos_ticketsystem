import Client from '../models/client';
import { Request, Response } from 'express';
import { handleError } from '../utils/errorHandler';

export const getClients = async (req: Request, res: Response): Promise<void> => {
  try {
    const clients = await Client.findAll();
    res.json(clients);
  } catch (error) {
    handleError(res, error);
  }
};

export const getClientById = async (req: Request, res: Response): Promise<void> => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) {
      res.status(404).json({ error: 'Client not found' });
      return;
    }
    res.json(client);
  } catch (error) {
    handleError(res, error);
  }
};

export const getClientByIdentification  = async (req: Request, res: Response): Promise<void> => {
  try {
    const client = await Client.findOne({ where: { identification: req.params.identification } });
    if (!client) {
      res.status(404).json({ error: 'Client not found' });
      return;
    }
    res.json(client);
  } catch (error) {
    handleError(res, error);
  }
};

export const createClient = async (req: Request, res: Response): Promise<void> => {
  try {
    const newClient = await Client.create(req.body);
    res.status(201).json(newClient);
  } catch (error) {
    handleError(res, error, 400);
  }
};

export const updateClient = async (req: Request, res: Response): Promise<void> => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) {
      res.status(404).json({ error: 'Client not found' });
      return;
    }
    await client.update(req.body);
    res.json(client);
  } catch (error) {
    handleError(res, error, 400);
  }
};

export const deleteClient = async (req: Request, res: Response): Promise<void> => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) {
      res.status(404).json({ error: 'Client not found' });
      return;
    }
    await client.destroy();
    res.json({ message: 'Client deleted' });
  } catch (error) {
    handleError(res, error);
  }
};



