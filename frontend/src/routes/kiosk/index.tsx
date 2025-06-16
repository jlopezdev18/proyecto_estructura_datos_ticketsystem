import { createFileRoute } from '@tanstack/react-router'
import  { useState, useEffect } from 'react';
import { NumericKeypad } from '../../components/kiosk/NumericKeyboard';
import { ServiceCard } from '../../components/kiosk/ServiceCard';
import { TicketDisplay } from '../../components/kiosk/TicketDisplay';
import { services } from '../../data/services';
import type { Screen, Ticket } from '../../types';
import { User, ArrowRight, CheckCircle, Clock, Heart } from 'lucide-react';
import axios, { AxiosError } from 'axios';

export const Route = createFileRoute('/kiosk/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('identification');
  const [userId, setUserId] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [clientName, setClientName] = useState<string | null>(null);
  const [isPriority, setIsPriority] = useState(false);

  const handleNumberPress = (number: string) => {
    if (userId.length < 13) {
      setUserId(prev => prev + number);
    }
  };

  const handleBackspace = () => {
    setUserId(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setUserId('');
  };

  const handleContinueToServices = async () => {
    try {
      if (userId.length < 13) return;
      const response = await axios.get(`http://localhost:3000/api/clients/identification/${userId}`);
      setClientName(response.data.name);
      
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          setClientName('Cliente Nuevo');  
        }
      }
      console.error(error);
    } finally {
      setCurrentScreen('services');
    }
  };

  const handleServiceSelect = (service: string) => {
    setSelectedService(service);
    setCurrentScreen('priority');
  };

  const handlePrioritySelect = async (priority: boolean) => {
    setIsPriority(priority);
    setIsLoading(true);


    try {
      const response = await axios.post('http://localhost:3000/api/tickets', {
        service: selectedService,
        isPriority,
        clientName,
        clientIdentification: userId
      });
      setCurrentTicket({ ...response.data, userId, isPriority });
      setCurrentScreen('ticket');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);  
      setCurrentScreen('ticket');
    }
  };

  const handleBackToServices = () => {
    setCurrentScreen('services');
    setSelectedService('');
  };

  const resetToStart = () => {
    setCurrentScreen('identification');
    setUserId('');
    setSelectedService('');
    setCurrentTicket(null);
    setIsPriority(false);
  };

  useEffect(() => {
    if (currentScreen === 'ticket') {
      const timer = setTimeout(() => {
        resetToStart();
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-blue-900">Generando su ticket...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {currentScreen === 'identification' && (
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg">
            <div className="text-center mb-8">
              <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-blue-900 mb-2">Sistema de Tickets</h1>
              <p className="text-gray-600">Ingrese su número de identificación</p>
            </div>

            <div className="mb-8">
              <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 text-center mb-6">
                <input
                  type="text"
                  value={userId}
                  readOnly
                  placeholder="Número de identificación"
                  className="bg-transparent text-2xl font-mono text-center w-full outline-none text-blue-900 placeholder-gray-400"
                />
              </div>
              
              <NumericKeypad
                onNumberPress={handleNumberPress}
                onBackspace={handleBackspace}
                onClear={handleClear}
              />
            </div>

            <button
              onClick={handleContinueToServices}
              disabled={userId.length < 6}
              className={`w-full p-4 rounded-xl font-bold text-lg flex items-center justify-center space-x-2 
                       transition-all duration-200 touch-manipulation select-none
                       ${userId.length >= 6 
                         ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg active:scale-95' 
                         : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            >
              <span>Continuar</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {currentScreen === 'services' && (
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-4xl">
            <div className="text-center mb-8">
              <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-blue-900 mb-2">
                ¡Bienvenido/a! {clientName}
              </h1>
              <p className="text-gray-600 mb-2">ID: {userId}</p>
              <p className="text-lg text-gray-700">Seleccione el servicio que necesita</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  icon={service.icon}
                  title={service.name}
                  description={service.description}
                  color={service.color}
                  onClick={() => handleServiceSelect(service.id)}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrentScreen('identification')}
              className="w-full md:w-auto px-8 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 
                       rounded-xl font-semibold transition-all duration-200 
                       active:scale-95 touch-manipulation select-none"
            >
              ← Volver
            </button>
          </div>
        </div>
      )}

      {currentScreen === 'priority' && (
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-4xl">
            <div className="text-center mb-8">
              <div className="bg-purple-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-10 h-10 text-purple-600" />
              </div>
              <h1 className="text-3xl font-bold text-blue-900 mb-2">
                Seleccione su tipo de atención
              </h1>
              <p className="text-gray-600 mb-2">Servicio seleccionado: {selectedService}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <button
                onClick={() => handlePrioritySelect(false)}
                className="bg-white border-2 border-blue-200 rounded-xl p-6 hover:border-blue-500 
                         transition-all duration-200 active:scale-95 touch-manipulation select-none"
              >
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-blue-900 mb-2">Normal</h3>
                  <p className="text-gray-600">Atención regular</p>
                </div>
              </button>

              <button
                onClick={() => handlePrioritySelect(true)}
                className="bg-white border-2 border-purple-200 rounded-xl p-6 hover:border-purple-500 
                         transition-all duration-200 active:scale-95 touch-manipulation select-none"
              >
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-purple-900 mb-2">Tercera Edad o Embarazadas</h3>
                  <p className="text-gray-600">Atención prioritaria</p>
                </div>
              </button>
            </div>

            <button
              onClick={handleBackToServices}
              className="w-full md:w-auto px-8 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 
                       rounded-xl font-semibold transition-all duration-200 
                       active:scale-95 touch-manipulation select-none"
            >
              ← Volver
            </button>
          </div>
        </div>
      )}

      {currentScreen === 'ticket' && currentTicket && (
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
          <div className="mb-8">
            <TicketDisplay
              ticketNumber={currentTicket.code}
              userId={currentTicket.clientIdentification}
              service={currentTicket.service}
              timestamp={currentTicket.createdAt}
            />
          </div>

          <div className="text-center bg-white rounded-xl p-6 shadow-lg">
            <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-lg font-semibold text-blue-900 mb-1">¡Ticket generado exitosamente!</p>
            <p className="text-gray-600">
              Regresando al inicio en unos segundos...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
