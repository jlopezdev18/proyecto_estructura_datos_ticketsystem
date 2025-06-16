import { useState, useCallback } from 'react';

export const useTicketGenerator = () => {
  const [ticketCounter, setTicketCounter] = useState(1);

  const generateTicket = useCallback((service: string) => {
    const ticketNumber = ticketCounter.toString().padStart(3, '0');
    setTicketCounter(prev => prev + 1);
    
    return {
      number: ticketNumber,
      service,
      timestamp: new Date().toISOString(),
    };
  }, [ticketCounter]);

  return { generateTicket };
};