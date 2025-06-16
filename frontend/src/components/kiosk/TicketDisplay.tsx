import React from 'react';
import { Calendar, Clock, Hash, User } from 'lucide-react';

interface TicketDisplayProps {
  ticketNumber: string;
  userId: string;
  service: string;
  timestamp: string;
}

export const TicketDisplay: React.FC<TicketDisplayProps> = ({
  ticketNumber,
  userId,
  service,
  timestamp,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-auto border-4 border-blue-100">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-blue-900 mb-2">Su Ticket</h2>
        <div className="w-16 h-1 bg-blue-500 mx-auto rounded-full"></div>
      </div>
      
      <div className="space-y-6">
        <div className="text-center">
          <div className="bg-blue-500 text-white rounded-xl p-6 mb-4">
            <Hash className="w-8 h-8 mx-auto mb-2" />
            <div className="text-4xl font-bold">{ticketNumber}</div>
            <div className="text-sm opacity-90">Número de Ticket</div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2 text-gray-600">
            <User className="w-4 h-4 text-blue-500" />
            <span>ID: {userId}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span>{new Date(timestamp).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600 col-span-2">
            <Clock className="w-4 h-4 text-blue-500" />
            <span>{new Date(timestamp).toLocaleTimeString()}</span>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <h3 className="font-semibold text-gray-800 mb-2">Servicio Solicitado:</h3>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <span className="text-green-800 font-medium">{service}</span>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-4 text-center">
          <p className="text-xs text-gray-500 leading-relaxed">
            Por favor conserve este ticket y espere a que sea llamado.
            Tiempo estimado de espera: 10-15 minutos.
          </p>
        </div>
      </div>
    </div>
  );
};