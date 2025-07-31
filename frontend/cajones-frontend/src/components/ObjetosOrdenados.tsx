import React from 'react';
import type { CajonObjeto } from '../services/api';

interface ObjetosOrdenadosProps {
  tipoOrdenamiento: string;
  resultado: any[];
  loading?: boolean;
}

const ObjetosOrdenados: React.FC<ObjetosOrdenadosProps> = ({ 
  tipoOrdenamiento, 
  resultado, 
  loading = false 
}) => {
  const getTamanioLabel = (tamanio: string) => {
    switch (tamanio) {
      case 'PE': return 'Pequeño';
      case 'ME': return 'Mediano';
      case 'GR': return 'Grande';
      default: return tamanio;
    }
  };

  const getTamanioColor = (tamanio: string) => {
    switch (tamanio) {
      case 'PE': return 'bg-green-100 text-green-800';
      case 'ME': return 'bg-yellow-100 text-yellow-800';
      case 'GR': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoOrdenamientoLabel = (tipo: string) => {
    switch (tipo) {
      case 'tipo': return 'Por Tipo de Objeto';
      case 'tamanio': return 'Por Tamaño';
      default: return tipo;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="h-16 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  // Aplanar la lista si viene agrupada
  let objetos: any[] = [];
  if (resultado.length > 0 && resultado[0].objetos) {
    objetos = resultado.flatMap((grupo: any) => grupo.objetos);
  } else {
    objetos = resultado;
  }

  if (!objetos.length) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4">📦</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay objetos</h3>
        <p className="text-gray-500">No se encontraron objetos para mostrar.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {objetos.map((objeto, idx) => (
        <div
          key={objeto.id || idx}
          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
        >
          <div className="flex items-center space-x-3">
            <span className="text-lg">📦</span>
            <div>
              <p className="font-medium text-gray-900">{objeto.nombre_objeto}</p>
              <p className="text-sm text-gray-600">
                {objeto.tipo_objeto?.nombre || objeto.tipo || ''}
                {objeto.tamanio && (
                  <span className="ml-2 text-xs text-gray-500">
                    ({objeto.tamanio || objeto.tamanio_display})
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ObjetosOrdenados;