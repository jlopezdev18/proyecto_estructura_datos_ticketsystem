import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Clock,
  User,
  Hash,
  CheckCircle,
  XCircle,
  RotateCcw,
  ArrowRight,
  Users,
  Timer,
  Star,
  AlertCircle,
  Calendar,
} from "lucide-react";
import { WindowSelection } from "../../components/cashier/WindowSelection";
import type { Window, Ticket } from "@/types";
import axios from "axios";
import { useSocket } from "@/hooks/useSocket";

interface CurrentTicket extends Ticket {
  startTime: Date;
}

interface DayStats {
  totalServed: number;
  averageTime: number;
  normalQueue: number;
  priorityQueue: number;
  absent: number;
}

export const Route = createFileRoute("/cashier/")({
  component: RouteComponent,
});

function RouteComponent() {
  const socket = useSocket();

  const [currentWindow, setCurrentWindow] = useState<Window | null>(null);
  const [normalQueue, setNormalQueue] = useState<Ticket[]>([]);

  const [priorityQueue, setPriorityQueue] = useState<Ticket[]>([]);

  const [currentTicket, setCurrentTicket] = useState<CurrentTicket | null>(
    null
  );

  const [attendanceTime, setAttendanceTime] = useState(0);
  const [serviceStats, setServiceStats] = useState({
    totalServed: 0,
    absentTickets: [],
    averageWaitTime: 0,
    attendingTickets: [],
    finishedTickets: [],
  });
  const [dayStats, setDayStats] = useState<DayStats>({
    totalServed: serviceStats.totalServed,
    averageTime: serviceStats.averageWaitTime,
    normalQueue: normalQueue.length,
    priorityQueue: priorityQueue.length,
    absent: serviceStats.absentTickets.length,
  });

  useEffect(() => {
    if (!currentWindow) return;
    axios
      .get(
        `http://localhost:3000/api/tickets/${encodeURIComponent(currentWindow.services.join(","))}/stats`
      )
      .then((res) => setServiceStats(res.data));
  }, [currentWindow]);
  console.log(serviceStats);
  useEffect(() => {
    setDayStats({
      totalServed: serviceStats.totalServed,
      averageTime: serviceStats.averageWaitTime,
      normalQueue: normalQueue.length,
      priorityQueue: priorityQueue.length,
      absent: serviceStats.absentTickets.length,
    });
  }, [serviceStats, normalQueue, priorityQueue]);
  const getTickets = async () => {
    if (!currentWindow) return;
    const normalQueueResponse = await axios.post(
      `http://localhost:3000/api/tickets/queue`,
      {
        services: currentWindow.services,
        isPriority: false,
      }
    );
    const priorityQueueResponse = await axios.post(
      `http://localhost:3000/api/tickets/queue`,
      {
        services: currentWindow.services,
        isPriority: true,
      }
    );
    setNormalQueue(normalQueueResponse.data);
    setPriorityQueue(priorityQueueResponse.data);
  };

  useEffect(() => {
    if (!socket) return;
    socket.on("newTicket", (data) => {
      if (!currentWindow) return;
      if (currentWindow.services.includes(data.service)) {
        getTickets();
      }
    });

    socket.on("ticketAttended", (data) => {
      if (!currentWindow) return;
      if (currentWindow.services.includes(data.service)) {
        getTickets();
      }
    });

    return () => {
      socket.off("newTicket");
      socket.off("ticketAttended");
    };
  }, [socket, currentWindow, currentTicket]);

  useEffect(() => {
    if (!currentWindow) return;

    const fetchCurrentTicket = async () => {
      if (!currentWindow.currentTicketId) return;
      const ticket = await axios.get(
        `http://localhost:3000/api/tickets/${currentWindow.currentTicketId}`
      );
      setCurrentTicket({
        ...ticket.data,
        startTime: new Date(),
      });
    };
    fetchCurrentTicket();
  }, [currentWindow]);

  useEffect(() => {
    getTickets();
  }, [currentWindow]);

  // Update attendance time every second
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentTicket) {
        const elapsed = Math.floor(
          (Date.now() - currentTicket.startTime.getTime()) / 1000
        );
        setAttendanceTime(elapsed);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentTicket]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const callNextTicket = async (queueType: "normal" | "priority") => {
    if (!currentWindow) return;
    let nextTicket: Ticket | undefined;
    const response = await axios.post(
      `http://localhost:3000/api/tickets/next`,
      {
        services: currentWindow.services,
        isPriority: queueType === "priority",
        windowId: currentWindow.id,
      }
    );
    // eslint-disable-next-line prefer-const
    nextTicket = response.data;
    console.log(nextTicket);

    if (nextTicket) {
      setCurrentTicket({
        ...nextTicket,
        startTime: new Date(),
      });
      setAttendanceTime(0);
    }
  };

  const finishTicket = async () => {
    if (!currentWindow || !currentTicket) return;
    axios.post(`http://localhost:3000/api/tickets/finish`, {
      ticketId: currentTicket.id,
      windowId: currentWindow.id,
    });
    setCurrentTicket(null);
    setAttendanceTime(0);
  };

  const markAsAbsent = async () => {
    if (!currentWindow || !currentTicket) return;

    axios.post(`http://localhost:3000/api/tickets/mark-as-absent`, {
      ticketId: currentTicket.id,
      windowId: currentWindow.id,
    });
    setCurrentTicket(null);
    setAttendanceTime(0);
  };

  const callAgain = () => {
    if (currentTicket && currentWindow) {
      axios.post(`http://localhost:3000/api/tickets/call-again`, {
        ticketId: currentTicket.id,
        windowId: currentWindow.id,
      });
    }
  };

  // Window selection screen
  if (!currentWindow) {
    return <WindowSelection onWindowSelect={setCurrentWindow} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Hash className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Sistema de Tickets
                </h1>
                <p className="text-sm text-gray-500">
                  Panel de Cajero - Ventanilla {currentWindow.number}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date().toLocaleDateString("es-ES", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Current Ticket Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Ticket en Atención
            </h2>
            {currentTicket ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          currentTicket.isPriority
                            ? "bg-red-100 text-red-600"
                            : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        {currentTicket.isPriority ? (
                          <Star className="w-5 h-5" />
                        ) : (
                          <Hash className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          Número de Ticket
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          #{currentTicket.code}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">ID de Ticket</p>
                      <p className="font-medium text-gray-900">
                        {currentTicket.id}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Cliente</p>
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <p className="font-medium text-gray-900">
                          {currentTicket.clientName || "Sin nombre"}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Servicio</p>
                      <p className="font-medium text-gray-900">
                        {currentTicket.service}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        Tiempo de Atención
                      </p>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-green-500" />
                        <p className="text-2xl font-bold text-green-600">
                          {formatTime(attendanceTime)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={finishTicket}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Terminar Ticket</span>
                  </button>
                  <button
                    onClick={markAsAbsent}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Marcar Ausente</span>
                  </button>
                  <button
                    onClick={callAgain}
                    className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Volver a Llamar</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 p-8 text-center">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 text-lg">
                  No hay ticket en atención
                </p>
                <p className="text-gray-400 text-sm">
                  Selecciona un ticket de las colas disponibles
                </p>
              </div>
            )}
          </div>

          {/* Queues Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Normal Queue */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Cola Normal
                    </h3>
                    <p className="text-sm text-gray-500">
                      {normalQueue.length} tickets pendientes
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => callNextTicket("normal")}
                  disabled={normalQueue.length === 0}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>Llamar Siguiente</span>
                </button>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto">
                {normalQueue.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No hay tickets en cola
                  </p>
                ) : (
                  normalQueue.map((ticket, index) => (
                    <div
                      key={ticket.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            #{ticket.code}
                          </p>
                          <p className="text-sm text-gray-500">
                            {ticket.service}
                          </p>
                          {ticket.clientName && (
                            <p className="text-xs text-gray-400">
                              {ticket.clientName}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Priority Queue */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <Star className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Cola Prioritaria
                    </h3>
                    <p className="text-sm text-gray-500">
                      {priorityQueue.length} tickets pendientes
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => callNextTicket("priority")}
                  disabled={priorityQueue.length === 0}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>Llamar Siguiente</span>
                </button>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto">
                {priorityQueue.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No hay tickets prioritarios
                  </p>
                ) : (
                  priorityQueue.map((ticket, index) => (
                    <div
                      key={ticket.id}
                      className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-red-600 text-white rounded-lg flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            #{ticket.code}
                          </p>
                          <p className="text-sm text-gray-500">
                            {ticket.service}
                          </p>
                          {ticket.clientName && (
                            <p className="text-xs text-gray-400">
                              {ticket.clientName}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                        <Star className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar with Stats */}
        <div className="w-80 bg-white border-l border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Estadísticas del Día
          </h3>

          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">
                    Tickets Atendidos
                  </p>
                  <p className="text-2xl font-bold text-blue-900">
                    {dayStats.totalServed}
                  </p>
                </div>
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">
                    Tiempo Promedio
                  </p>
                  <p className="text-2xl font-bold text-green-900">
                    {dayStats.averageTime} min
                  </p>
                </div>
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <Timer className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-700">Ausentes</p>
                  <p className="text-2xl font-bold text-red-900">
                    {dayStats.absent}
                  </p>
                </div>
                <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">
                    En Cola Total
                  </p>
                  <p className="text-2xl font-bold text-purple-900">
                    {normalQueue.length + priorityQueue.length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
