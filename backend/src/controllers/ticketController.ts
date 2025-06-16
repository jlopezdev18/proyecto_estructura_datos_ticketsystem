import {Request, Response} from 'express';
import Ticket from '../models/ticket';
import {handleError} from '../utils/errorHandler';
import Window from '../models/window';
import { Op } from 'sequelize';



class Queue {
  private tickets: Ticket[]

  constructor() {
    this.tickets = [];
  }

  addTicket(ticket: Ticket) { 
    this.tickets.push(ticket);
  }

  getNextTicket() {
    return this.tickets.shift();
  }
  
  getAllTickets() {
    return this.tickets;
  }

  getQueueLength() {
    return this.tickets.length;
  }
  
  getTicketById(id: number) {
    return this.tickets.find(ticket => ticket.id === id);
  }
}


const queues = {
  'cuentas.normal': new Queue(),
  'cuentas.prioritaria': new Queue(),
  'tarjetas.normal': new Queue(),
  'tarjetas.prioritaria': new Queue(),
  'prestamos.normal': new Queue(),
  'prestamos.prioritaria': new Queue(),
  'inversiones.normal': new Queue(),
  'inversiones.prioritaria': new Queue(),
  'seguros.normal': new Queue(),
  'seguros.prioritaria': new Queue(),
  'empresas.normal': new Queue(),
  'empresas.prioritaria': new Queue(),
}

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
    const { service } = req.body;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const lastTicket = await Ticket.findOne({
      where: {
        service,
        createdAt: {
          [Op.gte]: today
        }
      },
      order: [['createdAt', 'DESC']]
    });

    const serviceCode = service.charAt(0).toUpperCase();
    let nextNumber = 1;
    if (lastTicket) {
      const lastNumber = parseInt(lastTicket.code.substring(1));
      nextNumber = lastNumber + 1;
    }
    
    const ticketNumber = nextNumber.toString().padStart(3, '0');
    const ticketCode = `${serviceCode}${ticketNumber}`;

    const newTicket = await Ticket.create({
      ...req.body,
      code: ticketCode
    });

    const queue = queues[`${service}.${req.body.isPriority ? 'prioritaria' : 'normal'}` as keyof typeof queues];
    queue.addTicket(newTicket);
    
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

