import React from 'react';
import type { CajonHistorial } from '../services/api';

interface HistorialListProps {
  historial: CajonHistorial[];
  loading?: boolean;
}

const HistorialList: React.FC<HistorialListProps> = ({ historial, loading = false }) => {
  const getAccionIcon = (accion: string) => {
    switch (accion) {
      case 'creado':
        return '📦';
      case 'modificado':
        return '✏️';
      case 'eliminado':
        return '🗑️';
      case 'objeto_agregado':
        return '➕';
      case 'objeto_modificado':
        return '✏️';
      case 'objeto_eliminado':
        return '➖';
      case 'objeto_movido':
        return '🔄';
      case 'objeto_recibido':
        return '📥';
      default:
        return '📋';
    }
  };

  const getAccionColor = (accion: string) => {
    switch (accion) {
      case 'creado':
      case 'objeto_agregado':
      case 'objeto_recibido':
        return 'text-green-600 bg-green-50';
      case 'modificado':
      case 'objeto_modificado':
        return 'text-yellow-600 bg-yellow-50';
      case 'eliminado':
      case 'objeto_eliminado':
        return 'text-red-600 bg-red-50';
      case 'objeto_movido':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatFecha = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="h-16 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (historial.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4">📋</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay historial</h3>
        <p className="text-gray-500">Aún no se han registrado actividades en el sistema.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {historial.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow duration-200"
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <span className="text-2xl">{getAccionIcon(item.accion)}</span>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAccionColor(item.accion)}`}>
                    {item.accion.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className="text-sm text-gray-500">
                    {formatFecha(item.fecha)}
                  </span>
                </div>
              </div>
              
              <p className="mt-1 text-sm text-gray-900">
                {item.descripcion}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HistorialList; 