import React, { useState, useEffect } from 'react';
import LayoutHome from '../layout/layout_home';
import HistorialList from '../components/HistorialList';
import { apiService } from '../services/api';
import type { CajonHistorial } from '../services/api';

const Historial: React.FC = () => {
  const [historial, setHistorial] = useState<CajonHistorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroAccion, setFiltroAccion] = useState<string>('');

  useEffect(() => {
    cargarHistorial();
  }, []);

  const cargarHistorial = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getHistorial();
      setHistorial(data);
    } catch (err) {
      setError('Error al cargar el historial. Por favor, intenta de nuevo.');
      console.error('Error cargando historial:', err);
    } finally {
      setLoading(false);
    }
  };

  const historialFiltrado = historial.filter(item => 
    filtroAccion === '' || item.accion === filtroAccion
  );

  const accionesUnicas = Array.from(new Set(historial.map(item => item.accion)));

  const getEstadisticasAcciones = () => {
    const stats = historial.reduce((acc, item) => {
      acc[item.accion] = (acc[item.accion] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    return stats;
  };

  const estadisticas = getEstadisticasAcciones();

  if (error) {
    return (
      <LayoutHome>
        <div className="text-center py-8">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={cargarHistorial}
            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            Reintentar
          </button>
        </div>
      </LayoutHome>
    );
  }

  return (
    <LayoutHome>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Historial de Actividades</h2>
            <p className="text-gray-600 mt-1">Registro de todas las acciones realizadas en el sistema</p>
          </div>
          <button
            onClick={cargarHistorial}
            disabled={loading}
            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50"
          >
            {loading ? 'Actualizando...' : 'Actualizar'}
          </button>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(estadisticas).map(([accion, cantidad]) => (
            <div key={accion} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-2xl font-bold text-primary">{cantidad}</div>
              <div className="text-sm text-gray-600 capitalize">
                {accion.replace('_', ' ')}
              </div>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Filtrar por acción:</label>
            <select
              value={filtroAccion}
              onChange={(e) => setFiltroAccion(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Todas las acciones</option>
              {accionesUnicas.map(accion => (
                <option key={accion} value={accion}>
                  {accion.replace('_', ' ').toUpperCase()}
                </option>
              ))}
            </select>
            {filtroAccion && (
              <button
                onClick={() => setFiltroAccion('')}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Limpiar filtro
              </button>
            )}
          </div>
        </div>

        {/* Lista de historial */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Actividades Recientes
              {filtroAccion && (
                <span className="text-sm font-normal text-gray-500 ml-2">
                  (Filtrado por: {filtroAccion.replace('_', ' ').toUpperCase()})
                </span>
              )}
            </h3>
            <span className="text-sm text-gray-500">
              {historialFiltrado.length} actividades
            </span>
          </div>
          
          <HistorialList historial={historialFiltrado} loading={loading} />
        </div>
      </div>
    </LayoutHome>
  );
};

export default Historial; 