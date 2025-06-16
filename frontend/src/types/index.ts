export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface Ticket {
  id: number;
  code: string;
  service: string;
  isPriority: boolean;
  clientName?: string;
  clientIdentification: string;
  currentTicketId?: number;
  calledAt?: string;
  createdAt: string;
  status: string;
}

export type Screen = 'identification' | 'services' | 'priority' | 'ticket';

export type Window = {
  id: number;
  number: number;
  services: string[];
  currentTicketId?: number;
}