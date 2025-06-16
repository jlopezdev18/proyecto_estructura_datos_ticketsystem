import type { Window } from '@/types';
import axios from 'axios';
import { Monitor } from 'lucide-react';
import { useEffect, useState } from 'react';


interface WindowSelectionProps {
  onWindowSelect: (window: Window) => void;
}

export function WindowSelection({ onWindowSelect }: WindowSelectionProps) {

  const [windows, setWindows] = useState<Window[]>([]);
  const [selectedWindow, setSelectedWindow] = useState<Window | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchWindows = async () => {
      setIsLoading(true);
      const response = await axios.get('http://localhost:3000/api/windows');
      setWindows(
        response.data.map((window: any) => ({
          ...window,
          services: window.services.split(',')
        }))
      );
      setIsLoading(false);
    }
    fetchWindows();
  }, []);

  const handleLogin = () => {
    if (selectedWindow) {
      onWindowSelect(selectedWindow);
    }
  }
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Monitor className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Selección de Ventanilla</h2>
            <p className="text-gray-500 mt-2">Por favor, seleccione la ventanilla que desea atender</p>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="window" className="block text-sm font-medium text-gray-700 mb-2">
                Ventanilla
              </label>
              <select
                id="window"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedWindow?.id}
                disabled={isLoading}
                onChange={(e) => setSelectedWindow(windows.find((window) => window.id === parseInt(e.target.value)) || null)}
              >
                <option value="">Seleccione una ventanilla</option>
                {windows.map((window) => (
                  <option key={window.id} value={window.id}>Ventanilla {window.number}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleLogin}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              disabled={isLoading}
            >
              Iniciar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 