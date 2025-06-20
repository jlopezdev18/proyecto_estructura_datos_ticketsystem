import { useEffect, useState } from "react";
import axios from "axios";
import type { Window, Ticket } from "@/types";

interface WindowWithTicket extends Window {
  currentTicket?: Ticket | null;
}

function AttendedWindows() {
  const [windows, setWindows] = useState<WindowWithTicket[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWindowsAndTickets = async () => {
      setLoading(true);
      try {
        const windowsRes = await axios.get("http://localhost:3000/api/windows");
        const windowsData: Window[] = windowsRes.data;

        // Para cada ventanilla, si tiene currentTicketId, obtener el ticket
        const windowsWithTickets: WindowWithTicket[] = await Promise.all(
          windowsData.map(async (w) => {
            if (w.currentTicketId) {
              try {
                const ticketRes = await axios.get(`/api/tickets/${w.currentTicketId}`);
                return { ...w, currentTicket: ticketRes.data };
              } catch {
                return { ...w, currentTicket: null };
              }
            }
            return { ...w, currentTicket: null };
          })
        );
        setWindows(windowsWithTickets);
      } finally {
        setLoading(false);
      }
    };

    fetchWindowsAndTickets();
  }, []);

  return (
    <div className="mb-6">
      <h4 className="text-md font-semibold text-gray-900 mb-2">Ventanillas en Atención</h4>
      {loading ? (
        <div className="text-gray-500 text-sm">Cargando...</div>
      ) : (
        <ul className="divide-y">
          {windows.map((w) => (
            <li key={w.id} className="py-2">
              <div className="font-semibold">
                Ventanilla #{w.number}
              </div>
              {w.currentTicket ? (
                <div className="text-sm text-gray-700">
                  Ticket: <span className="font-bold">#{w.currentTicket.code}</span><br />
                  Cliente: {w.currentTicket.clientName || "Sin nombre"}<br />
                  Servicio: {w.currentTicket.service}
                </div>
              ) : (
                <div className="text-xs text-gray-400">Sin ticket en atención</div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AttendedWindows;