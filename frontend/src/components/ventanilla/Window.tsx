/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect, useState } from "react";
import { Plus, List as ListIcon } from "lucide-react";
import axios from "axios";


interface Window {
  id: number;
  number: number;
  services: string;
  currentTicketId: number | null;
}

export default function WindowSidebar() {
  const [windows, setWindows] = useState<Window[]>([]);
  const [showAddWindow, setShowAddWindow] = useState(false);
  const [showListWindow, setShowListWindow] = useState(false);
  const [newNumber, setNewNumber] = useState<number>(windows.length + 1);
  const [newServices, setNewServices] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    axios.get("http://localhost:3000/api/windows")
      .then(res => setWindows(res.data))
  }, []);

  const handleAddWindow = async () => {
    if (!newNumber || !newServices.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("http://localhost:3000/api/windows", {
        number: newNumber,
        services: newServices.trim(),
        currentTicketId: null,
      });
      // Suponiendo que el backend retorna la ventanilla creada con su id
      setWindows((prev) => [...prev, response.data]);
      setNewNumber(windows.length + 2);
      setNewServices("");
      setShowAddWindow(false);
    } catch (error: any) {
      setError("Error al agregar la ventanilla.");
    } 
  };

  return (
    <div className="flex flex-col gap-2 mt-auto">
      <button
        onClick={() => setShowAddWindow(true)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mb-2"
      >
        <Plus className="w-4 h-4" />
        Agregar Ventanilla
      </button>
      <button
        onClick={() => setShowListWindow(true)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
      >
        <ListIcon className="w-4 h-4" />
        Ver Ventanillas
      </button>

      {/* Modal: Agregar Ventanilla */}
      {showAddWindow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h4 className="text-lg font-semibold mb-4">Agregar Ventanilla</h4>
            <input
              type="number"
              className="w-full border rounded px-3 py-2 mb-3"
              placeholder="Número de ventanilla"
              value={newNumber}
              onChange={(e) => setNewNumber(Number(e.target.value))}
              min={1}
            />
            <input
              type="text"
              className="w-full border rounded px-3 py-2 mb-4"
              placeholder="Servicios (ej: general, creditos)"
              value={newServices}
              onChange={(e) => setNewServices(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAddWindow(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddWindow}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Listado de Ventanillas */}
      {showListWindow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 max-h-[70vh] overflow-y-auto">
            <h4 className="text-lg font-semibold mb-4">Lista de Ventanillas</h4>
            <ul className="divide-y">
              {windows.length === 0 ? (
                <li className="py-2 text-gray-500">No hay ventanillas registradas.</li>
              ) : (
                windows.map((w) => (
                  <li key={w.id} className="py-2 flex flex-col">
                    <span className="font-semibold">Ventanilla #{w.number}</span>
                    <span className="text-sm text-gray-600">Servicios: {w.services}</span>
                    <span className="text-xs text-gray-400">
                      Ticket actual: {w.currentTicketId ?? "Ninguno"}
                    </span>
                  </li>
                ))
              )}
            </ul>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowListWindow(false)}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}