import {Request, Response} from 'express';
import Ticket from '../models/ticket';
import {handleError} from '../utils/errorHandler';
import Window from '../models/window';
import { Op } from 'sequelize';
import { io } from '../socket';



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
    console.log(req.body);
    const newTicket = await Ticket.create({
      ...req.body,
      code: ticketCode
    });

    const queue = queues[`${service}.${req.body.isPriority ? 'prioritaria' : 'normal'}` as keyof typeof queues];
    queue.addTicket(newTicket);
    
    // Emit socket event for new ticket
    io.emit('newTicket', {
      service: service,
    });
    console.log('newTicket', {
      service: service,
    });
    
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


export const getQueueTickets = async (req: Request, res: Response): Promise<void> => {
  try {
    const { services, isPriority } = req.body as { services: string[], isPriority: boolean };

    const tickets = [];
    for (const service of services) {
      const queue = queues[`${service}.${isPriority ? 'prioritaria' : 'normal'}` as keyof typeof queues];
      tickets.push(...queue.getAllTickets());
    }
    res.json(tickets);
  } catch (error) {
    handleError(res, error);
  }
};


export const getNextTicket = async (req: Request, res: Response): Promise<void> => {
  try {
    const { services, isPriority, windowId } = req.body as { services: string[], isPriority: boolean, windowId: number };
    let ticket = null;
    for (const service of services) {
      const queue = queues[`${service}.${isPriority ? 'prioritaria' : 'normal'}` as keyof typeof queues];
      ticket = queue.getNextTicket();
      if (ticket) break;
    }
    if (ticket) {
      const window = await Window.findByPk(windowId);
      if (!window) {
        res.status(404).json({error: 'Window not found'});
        return;
      }
      if (window) {
        await window.update({
          currentTicketId: ticket.id
        });
      }
      await ticket.update({
        status: 'in_progress',
        calledAt: new Date(),
        attendedAt: new Date()
      });
      io.emit('ticketAttended', {
        service: ticket.service,
        ticket: ticket.code
      });
      io.emit('ticketCalled', {
        service: ticket.service,
        ticket: ticket.code,
        windowNumber: window.number
      });
    }
    res.json(ticket);
  } catch (error) {
    handleError(res, error);
  }
}


export const callAgain = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ticketId, windowId } = req.body as { ticketId: number, windowId: number };
    const ticket = await Ticket.findByPk(ticketId);
    const window = await Window.findByPk(windowId);

    if (!ticket) {
      res.status(404).json({error: 'Ticket not found'});
      return;
    }
    if (!window) {
      res.status(404).json({error: 'Window not found'});
      return;
    }
    await ticket.update({
      calledAt: new Date(),
    });
    io.emit('ticketCalled', {
      service: ticket.service,
      ticket: ticket.code,
      windowNumber: window.number
    });
    res.json(ticket);
  } catch (error) {
    handleError(res, error);
  }
}

export const markAsAbsent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ticketId, windowId } = req.body as { ticketId: number, windowId: number };
    const ticket = await Ticket.findByPk(ticketId);
    const window = await Window.findByPk(windowId);
    if (!ticket) {
      res.status(404).json({error: 'Ticket not found'});
      return;
    }
    if (!window) {
      res.status(404).json({error: 'Window not found'});
      return;
    }
    await ticket.update({
      status: 'finished',
      finishedAt: new Date(),
      isAbsent: true
    });
    await window.update({
      currentTicketId: null
    });
    io.emit('ticketFinished', {
      service: ticket.service,
      ticket: ticket.code,
      windowNumber: window.number
    });
    res.json(ticket);
  } catch (error) {
    handleError(res, error);
  }
}

export const finishTicket = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ticketId, windowId } = req.body as { ticketId: number, windowId: number };
    const ticket = await Ticket.findByPk(ticketId);
    const window = await Window.findByPk(windowId);
    if (!ticket) {
      res.status(404).json({error: 'Ticket not found'});
      return;
    }
    if (!window) {
      res.status(404).json({error: 'Window not found'});
      return;
    }
    await ticket.update({
      status: 'finished',
      finishedAt: new Date()
    });
    await window.update({
      currentTicketId: null
    });

    io.emit('ticketFinished', {
      service: ticket.service,
      ticket: ticket.code,
      windowNumber: window.number
    });
    res.json(ticket);
  } catch (error) {
    handleError(res, error);
  }
}


export async function getServiceStats(req: Request, res: Response): Promise<void> {
  const service = req.params.serviceName;
  const today = new Date();
  today.setHours(0, 0, 0, 0);


  const tickets = await Ticket.findAll({
    where: {
      service,
      createdAt: { [Op.gte]: today },
    },
  });

  
  const attended = tickets.filter(t => t.status === "finished");

  
  const absent = tickets.filter(t => t.isAbsent);

  
  const waitTimes = attended
    .filter(t => t.attendedAt && t.finishedAt)
    .map(
      t => (new Date(t.finishedAt!).getTime() - new Date(t.attendedAt!).getTime()) / 60000
    );
  const averageWaitTime =
    waitTimes.length > 0
      ? (waitTimes.reduce((a, b) => a + b, 0) / waitTimes.length).toFixed(2)
      : 0;

  
  const attending = tickets.filter(t => t.status === "pending");

  res.json({
    totalServed: attended.length,
    absentTickets: absent,
    averageWaitTime,
    attendingTickets: attending,
    finishedTickets: attended,
  });
}