import {Request, Response} from 'express';
import Ticket from '../models/ticket';
import {handleError} from '../utils/errorHandler';

export const getTickets = async (req: Request, res: Response): Promise<void> => {
  try {
    const tickets = await Ticket.findAll();
    res.json(tickets);
  } catch (error) {
    handleError(res, error);
  }
};

export const getTicketById = async (req: Request, res: Response): Promise<void> => {
  try {
    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) {
      res.status(404).json({error: 'Ticket not found'});
      return;
    }
    res.json(ticket);
  } catch (error) {
    handleError(res, error);
  }
};

export const createTicket = async (req: Request, res: Response): Promise<void> => {
  try {
    const newTicket = await Ticket.create(req.body);
    res.status(201).json(newTicket);
  } catch (error) {
    handleError(res, error, 400);
  }
};


export const updateTicket = async (req: Request, res: Response): Promise<void> => {
  try {
    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) {
      res.status(404).json({error: 'Ticket not found'});
      return;
    }
    await ticket.update(req.body);
    res.json(ticket);
  } catch (error) {
    handleError(res, error, 400);
  }
};

export const deleteTicket = async (req: Request, res: Response): Promise<void> => {
  try {
    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) {
      res.status(404).json({error: 'Ticket not found'});
      return;
    }
    await ticket.destroy();
    res.json({message: 'Ticket deleted'});
  } catch (error) {
    handleError(res, error);
  }
};

