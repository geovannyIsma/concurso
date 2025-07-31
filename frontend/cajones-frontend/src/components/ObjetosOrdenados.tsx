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
      case 'mixto': return 'Mixto (Tipo + Tamaño)';
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

  if (!resultado || resultado.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4">📦</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay objetos</h3>
        <p className="text-gray-500">No se encontraron objetos para mostrar con este ordenamiento.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Objetos Ordenados: {getTipoOrdenamientoLabel(tipoOrdenamiento)}
        </h3>
        <span className="text-sm text-gray-500">
          {resultado.length} {tipoOrdenamiento === 'tipo' ? 'tipos' : tipoOrdenamiento === 'tamanio' ? 'tamaños' : 'grupos'}
        </span>
      </div>

      <div className="space-y-4">
        {resultado.map((grupo, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
            {/* Header del grupo */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">
                  {tipoOrdenamiento === 'tipo' ? '🏷️' : tipoOrdenamiento === 'tamanio' ? '📏' : '🔀'}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    {tipoOrdenamiento === 'tipo' && grupo.tipo}
                    {tipoOrdenamiento === 'tamanio' && grupo.tamanio}
                    {tipoOrdenamiento === 'mixto' && `${grupo.tipo} - ${grupo.tamanio}`}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {grupo.cantidad} objeto{grupo.cantidad !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <div className="bg-primary-50 text-primary px-3 py-1 rounded-full text-sm font-medium">
                {grupo.cantidad}
              </div>
            </div>

            {/* Lista de objetos */}
            <div className="space-y-2">
              {grupo.objetos.map((objeto: CajonObjeto) => (
                <div key={objeto.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">📦</span>
                    <div>
                      <p className="font-medium text-gray-900">{objeto.nombre_objeto}</p>
                      <p className="text-sm text-gray-600">
                        {tipoOrdenamiento === 'tipo' && `Tamaño: ${getTamanioLabel(objeto.tamanio)}`}
                        {tipoOrdenamiento === 'tamanio' && `Tipo: ${objeto.tipo_objeto.nombre}`}
                        {tipoOrdenamiento === 'mixto' && `Cajón: ${objeto.cajon}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {tipoOrdenamiento !== 'tamanio' && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTamanioColor(objeto.tamanio)}`}>
                        {getTamanioLabel(objeto.tamanio)}
                      </span>
                    )}
                    {tipoOrdenamiento !== 'tipo' && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {objeto.tipo_objeto.nombre}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ObjetosOrdenados; 