import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Users,
  Clock,
  AlertCircle,
  CheckCircle,
  //   Play,
  Volume2,
  Image,
} from "lucide-react";
import axios from "axios";
import type { Ticket } from "../types";
import { useSocket } from "@/hooks/useSocket";

interface Advertisement {
  id: string;
  type: "image" | "video";
  title: string;
  content: string;
  duration: number;
}

interface TicketWithWindow extends Ticket {
  windowNumber: number;
}

export const Route = createFileRoute("/panel")({
  component: RouteComponent,
});

function RouteComponent() {
  const socket = useSocket();
  const [currentTicket, setCurrentTicket] = useState<{ticket: string, windowNumber: number, service: string} | null>(null);
  const [attendedTickets, setAttendedTickets] = useState<TicketWithWindow[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Mock data
  const advertisements: Advertisement[] = [
    {
      id: "1",
      type: "image",
      title: "Ofertas Especiales",
      content:
        "https://images.pexels.com/photos/1292294/pexels-photo-1292294.jpeg?auto=compress&cs=tinysrgb&w=400",
      duration: 5000,
    },
    {
      id: "2",
      type: "image",
      title: "Nuevos Servicios",
      content:
        "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400",
      duration: 5000,
    },
    {
      id: "3",
      type: "image",
      title: "Promociones",
      content:
        "https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg?auto=compress&cs=tinysrgb&w=400",
      duration: 5000,
    },
  ];

  const getTickets = async () => {
    const response = await axios.get(`http://localhost:3000/api/windows`);
    const ticketsPromises: Promise<TicketWithWindow>[] = response.data.filter((window:any) => window.currentTicketId).map(async (window:any) => {
      const ticket = await axios.get(`http://localhost:3000/api/tickets/${window.currentTicketId}`);
      return {
        ...ticket.data,
        windowNumber: window.number
      };
    });
    const tickets = await Promise.all(ticketsPromises);
    setAttendedTickets(tickets);
  };

  useEffect(() => {
    getTickets();
  }, []);


  // Rotate advertisements
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % advertisements.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [advertisements.length]);

  // Update current time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const callTicket = (ticket: string, windowNumber: number, service: string) => {
    const texto = `Ticket ${ticket}, favor presentarse a la  ventanilla ${windowNumber}`;

    const speech = new SpeechSynthesisUtterance(texto);
    speech.lang = "es-HN"; // Puedes usar "en-US", "es-ES", etc.
    // speech.pitch = 1; // Ajusta el tono de voz (0.1 a 2)
    speech.rate = 1; // Ajusta la velocidad de la voz (0.1 a 10)
    window.speechSynthesis.speak(speech);
  };

  useEffect(() => {
    if (!socket) return;
    socket.on("ticketCalled", async (data: any) => {
      
      callTicket(data.ticket, data.windowNumber, data.service);
      setCurrentTicket({
        ticket: data.ticket,
        service: data.service,
        windowNumber: data.windowNumber
      });
      getTickets();
    });
    socket.on("ticketFinished", (data: any) => {
      getTickets();
      if (currentTicket?.ticket === data.ticket) {
        setCurrentTicket(null);
      }
    });
    return () => {
      socket.off("ticketCalled");
      socket.off("ticketFinished");
    };
  }, [socket]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Sistema de Tickets
                </h1>
                <p className="text-sm text-slate-600">
                  Centro de Atención al Cliente
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600">Hora actual</p>
              <p className="text-lg font-semibold text-slate-900">
                {currentTime.toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Current Ticket Calling */}
      {currentTicket && (
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-8 animate-pulse">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Volume2 className="w-8 h-8 animate-bounce" />
                <h2 className="text-3xl font-bold">TICKET LLAMANDO</h2>
                <Volume2 className="w-8 h-8 animate-bounce" />
              </div>
              <div className="bg-white/20 rounded-2xl p-6 inline-block backdrop-blur-sm">
                <div className="text-6xl font-bold mb-2">
                  {currentTicket.ticket}
                </div>
                <div className="text-xl font-medium mb-1">
                  Ventanilla {currentTicket.windowNumber}
                </div>
                <div className="text-lg opacity-90">
                  {currentTicket.service}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="w-full mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column - Advertisements */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4">
                <div className="flex items-center space-x-2">
                  <Play className="w-5 h-5" />
                  <h3 className="text-lg font-semibold">Anuncios</h3>
                </div>
              </div> */}

              <div className="relative">
                <div className="aspect-video bg-slate-100 overflow-hidden">
                  <img
                    src={advertisements[currentAdIndex]?.content}
                    alt={advertisements[currentAdIndex]?.title}
                    className="w-full h-full object-cover transition-opacity duration-500"
                  />
                </div>
                <div className="absolute top-4 right-4">
                  <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1">
                    <Image className="w-4 h-4" />
                    <span>
                      {currentAdIndex + 1}/{advertisements.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* <div className="p-4">
                <h4 className="font-semibold text-slate-900 mb-2">
                  {advertisements[currentAdIndex].title}
                </h4>
                <div className="flex justify-center space-x-2">
                  {advertisements.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                        index === currentAdIndex
                          ? "bg-purple-600"
                          : "bg-slate-300"
                      }`}
                    />
                  ))}
                </div>
              </div> */}
            </div>

            {/* Additional Info Card */}
            {/* <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Información
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-600">Tickets en espera</span>
                  <span className="font-semibold text-slate-900">
                    {waitingTickets.length}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-600">Tiempo promedio</span>
                  <span className="font-semibold text-slate-900">12 min</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-slate-600">Estado del sistema</span>
                  <span className="flex items-center space-x-1 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-semibold">Activo</span>
                  </span>
                </div>
              </div>
            </div> */}
          </div>

          {/* Right Column - Waiting Tickets */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg">
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-6 h-6" />
                    <h3 className="text-xl font-semibold">
                      Tickets en Atención
                    </h3>
                  </div>

                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {attendedTickets.map((ticket, index) => (
                    <div
                      key={ticket.id}
                      className="bg-slate-50 rounded-xl p-5 border border-slate-200 hover:border-slate-300 transition-all duration-200 hover:shadow-md transform hover:-translate-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
                            #
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-900 text-lg">
                              {ticket.code}
                            </h4>
                            <p className="text-slate-600">{ticket.service}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">


       

                          <div className="text-right">
                            <p className="text-sm text-slate-500">Ventanilla</p>
                            <p className="font-bold text-2xl text-blue-600">
                              {ticket.windowNumber}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {attendedTickets.length === 0 && (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                      No hay tickets en espera
                    </h3>
                    <p className="text-slate-600">
                      Todos los clientes han sido atendidos.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
