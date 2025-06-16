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
  createdAt: string;
  status: string;
}

export type Screen = 'identification' | 'services' | 'priority' | 'ticket';