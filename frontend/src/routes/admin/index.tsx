import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Hash,
  Calendar,
  AlertCircle,
} from "lucide-react";
import type { Window, Ticket } from "@/types";
import axios from "axios";
import WindowSidebar from "../../components/ventanilla/Window";

interface CurrentTicket extends Ticket {
  startTime: Date;
}


export const Route = createFileRoute("/admin/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [windows, setWindows] = useState<Window[]>([]);
  const [selectedWindow, setSelectedWindow] = useState<Window | null>(null);
  const [currentTicket, setCurrentTicket] = useState<CurrentTicket | null>(null);
  const [clientNameInput, setClientNameInput] = useState("");


  // Cargar ventanillas al inicio
  useEffect(() => {
    axios.get("http://localhost:3000/api/windows").then((res) => setWindows(res.data));
  }, []);

  // Actualizar ticket actual al cambiar de ventanilla
  useEffect(() => {
    const fetchCurrentTicket = async () => {
      if (!selectedWindow || !selectedWindow.currentTicketId) {
        setCurrentTicket(null);
        return;
      }
      const ticket = await axios.get(
        `http://localhost:3000/api/tickets/${selectedWindow.currentTicketId}`
      );
      setCurrentTicket({
        ...ticket.data,
        startTime: new Date(),
      });
    };
    fetchCurrentTicket();
  }, [selectedWindow]);

  // Guardar nombre del cliente
  const handleSaveClientName = async () => {
    if (!currentTicket || !clientNameInput.trim()) return;
    await axios.put(`http://localhost:3000/api/tickets/${currentTicket.id}`, {
      clientName: clientNameInput.trim(),
    });
    setCurrentTicket({
      ...currentTicket,
      clientName: clientNameInput.trim(),
    });
    setClientNameInput("");
  };

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
                  Panel Admin - Ventanilla {selectedWindow?.number ?? "N/A"}
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
          {/* Selector de Ventanilla */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">
              Selecciona Ventanilla:
            </label>
            <select
              className="border rounded px-3 py-2"
              value={selectedWindow?.id ?? ""}
              onChange={(e) => {
                const win = windows.find(
                  (w) => w.id === Number(e.target.value)
                );
                setSelectedWindow(win ?? null);
              }}
            >
              <option value="">-- Selecciona --</option>
              {windows.map((w) => (
                <option key={w.id} value={w.id}>
                  Ventanilla #{w.number}
                </option>
              ))}
            </select>
          </div>

          {!selectedWindow ? (
            <div className="text-gray-500 text-center py-8">
              Selecciona una ventanilla para ver su ticket en atención.
            </div>
          ) : (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Ticket en Atención
              </h2>
              {currentTicket ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        Número de Ticket
                      </p>
                      <p className="text-2xl font-bold text-gray-900 mb-4">
                        #{currentTicket.code}
                      </p>
                      <p className="text-sm text-gray-500 mb-1">
                        ID de Ticket
                      </p>
                      <p className="font-medium text-gray-900 mb-4">
                        {currentTicket.id}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Cliente</p>
                      <div className="flex gap-2 items-center mb-4">
                        <span className="font-medium text-gray-900">
                          {currentTicket.clientName || "Sin nombre"}
                        </span>
                        <input
                          type="text"
                          className="border rounded px-2 py-1 text-sm"
                          placeholder="Agregar/Editar nombre"
                          value={clientNameInput}
                          onChange={e => setClientNameInput(e.target.value)}
                        />
                        <button
                          className="px-2 py-1 bg-blue-600 text-white rounded text-xs"
                          onClick={handleSaveClientName}
                          disabled={!clientNameInput.trim()}
                        >
                          Guardar
                        </button>
                      </div>
                      <p className="text-sm text-gray-500 mb-1">Servicio</p>
                      <p className="font-medium text-gray-900">
                        {currentTicket.service}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 p-8 text-center">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 text-lg">
                    No hay ticket en atención
                  </p>
                  <p className="text-gray-400 text-sm">
                    Selecciona una ventanilla para ver su ticket en atención.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar with Stats */}
        <div className="w-80 bg-white border-l border-gray-200 p-6">
          <WindowSidebar />
        </div>
      </div>
    </div>
  );
}