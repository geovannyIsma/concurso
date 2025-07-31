import React, { useState, useEffect } from 'react';
import LayoutHome from '../layout/layout_home';
import ObjetosOrdenados from '../components/ObjetosOrdenados';
import { apiService } from '../services/api';

const Recomendaciones: React.FC = () => {
  const [objetosOrdenados, setObjetosOrdenados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tipoOrdenamiento, setTipoOrdenamiento] = useState('tipo');
  const [ordenamientoLoading, setOrdenamientoLoading] = useState(false);

  const tiposOrdenamiento = [
    { value: 'tipo', label: 'Por Tipo de Objeto', description: 'Agrupa objetos por categorías', icon: '🏷️' },
    { value: 'tamanio', label: 'Por Tamaño', description: 'Organiza por tamaño de objetos', icon: '📏' },
    { value: 'mixto', label: 'Mixto', description: 'Combina tipo y tamaño', icon: '🔀' }
  ];

  const cargarOrdenamiento = async (nuevoTipo?: string) => {
    try {
      setOrdenamientoLoading(true);
      const tipo = nuevoTipo || tipoOrdenamiento;
      const data = await apiService.getOrdenamiento(tipo);
      setObjetosOrdenados(data.resultado || []);
    } catch (err) {
      setError('Error al cargar los objetos ordenados. Por favor, intenta de nuevo.');
      setObjetosOrdenados([]);
    } finally {
      setOrdenamientoLoading(false);
      setLoading(false);
    }
  };

  const cambiarOrdenamiento = async (nuevoTipo: string) => {
    setTipoOrdenamiento(nuevoTipo);
    await cargarOrdenamiento(nuevoTipo);
  };

  useEffect(() => {
    cargarOrdenamiento();
    // eslint-disable-next-line
  }, []);

  if (error) {
    return (
      <LayoutHome>
        <div className="text-center py-8">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => cargarOrdenamiento()}
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
            <h2 className="text-3xl font-bold text-gray-900">Objetos Ordenados</h2>
            <p className="text-gray-600 mt-1">Visualiza la lista de objetos ordenados según el criterio seleccionado</p>
          </div>
        </div>

        {/* Selector de tipo de ordenamiento */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Ordenamiento de Objetos
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {tiposOrdenamiento.map((tipo) => (
              <div
                key={tipo.value}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                  tipoOrdenamiento === tipo.value
                    ? 'border-primary bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => cambiarOrdenamiento(tipo.value)}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{tipo.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{tipo.label}</h4>
                    <p className="text-sm text-gray-600">{tipo.description}</p>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    tipoOrdenamiento === tipo.value
                      ? 'border-primary bg-primary'
                      : 'border-gray-300'
                  }`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Objetos Ordenados */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <ObjetosOrdenados
            tipoOrdenamiento={tipoOrdenamiento}
            resultado={objetosOrdenados}
            loading={ordenamientoLoading || loading}
          />
        </div>
      </div>
    </LayoutHome>
  );
};

export default Recomendaciones;