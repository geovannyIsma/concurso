import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LayoutHome from '../layout/layout_home';
import { apiService } from '../services/api';
import type { Cajon, Recomendacion } from '../services/api';

const Recomendaciones: React.FC = () => {
  const navigate = useNavigate();
  const [cajones, setCajones] = useState<Cajon[]>([]);
  const [recomendacionGeneral, setRecomendacionGeneral] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tipoOrdenamiento, setTipoOrdenamiento] = useState('tipo');

  const tiposOrdenamiento = [
    { value: 'tipo', label: 'Por Tipo de Objeto', description: 'Agrupa objetos por categorías' },
    { value: 'tamanio', label: 'Por Tamaño', description: 'Organiza por tamaño de objetos' },
    { value: 'mixto', label: 'Mixto', description: 'Combina tipo y tamaño' }
  ];

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      const [cajonesData, recomendacionData] = await Promise.all([
        apiService.getCajones(),
        apiService.getRecomendacion(tipoOrdenamiento)
      ]);
      setCajones(Array.isArray(cajonesData) ? cajonesData : []);
      setRecomendacionGeneral(recomendacionData.mensaje);
    } catch (err) {
      setError('Error al cargar los datos. Por favor, intenta de nuevo.');
      console.error('Error cargando datos:', err);
    } finally {
      setLoading(false);
    }
  };

  const generarRecomendacion = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getRecomendacion(tipoOrdenamiento);
      setRecomendacionGeneral(data.mensaje);
    } catch (err) {
      setError('Error al generar la recomendación. Por favor, intenta de nuevo.');
      console.error('Error generando recomendación:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  return (
    <LayoutHome>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Recomendaciones de Organización</h2>
            <p className="text-gray-600 mt-1">Obtén sugerencias inteligentes para organizar mejor tus cajones</p>
          </div>
          <button
            onClick={generarRecomendacion}
            disabled={loading}
            className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 flex items-center space-x-2"
          >
            <span>🤖</span>
            <span>{loading ? 'Generando...' : 'Nueva Recomendación'}</span>
          </button>
        </div>

        {/* Selector de tipo de ordenamiento */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Tipo de Organización
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tiposOrdenamiento.map((tipo) => (
              <div
                key={tipo.value}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                  tipoOrdenamiento === tipo.value
                    ? 'border-primary bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setTipoOrdenamiento(tipo.value)}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    tipoOrdenamiento === tipo.value
                      ? 'border-primary bg-primary'
                      : 'border-gray-300'
                  }`}></div>
                  <div>
                    <h4 className="font-medium text-gray-900">{tipo.label}</h4>
                    <p className="text-sm text-gray-600">{tipo.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recomendación general */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">💡</div>
              <h3 className="text-lg font-semibold text-gray-900">
                Recomendación General
              </h3>
            </div>
            <button
              onClick={generarRecomendacion}
              disabled={loading}
              className="bg-primary hover:bg-primary-dark text-white px-3 py-1 rounded-md text-sm transition-colors duration-200 disabled:opacity-50"
            >
              {loading ? 'Generando...' : 'Nueva'}
            </button>
          </div>

          {error ? (
            <div className="text-center py-8">
              <div className="text-red-500 text-4xl mb-4">⚠️</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error</h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <button
                onClick={generarRecomendacion}
                className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Reintentar
              </button>
            </div>
          ) : loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Generando recomendación...</p>
            </div>
          ) : recomendacionGeneral ? (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
              <div className="flex items-start space-x-3">
                <div className="text-2xl">🤖</div>
                <div className="flex-1">
                  <p className="text-gray-900 text-lg leading-relaxed">
                    {recomendacionGeneral}
                  </p>
                  <div className="mt-4 flex items-center space-x-2 text-sm text-gray-600">
                    <span>💡</span>
                    <span>Recomendación generada con IA</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Sin recomendación</h3>
              <p className="text-gray-500">Genera una nueva recomendación para ver sugerencias.</p>
            </div>
          )}
        </div>

        {/* Lista de cajones con recomendaciones específicas */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Cajones Disponibles
          </h3>
          <p className="text-gray-600 mb-4">
            Haz clic en un cajón para ver sus detalles y recomendaciones específicas de organización.
          </p>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="h-32 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : cajones.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📦</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay cajones</h3>
              <p className="text-gray-500">Crea algunos cajones para comenzar a recibir recomendaciones.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cajones.map((cajon) => (
                <div
                  key={cajon.id}
                  onClick={() => navigate(`/cajon/${cajon.id}`)}
                  className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors duration-200 border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{cajon.nombre}</h4>
                    <span className="text-2xl">📦</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {cajon.objetos?.length || 0} / {cajon.capacidad_maxima} objetos
                  </p>
                  <div className="text-xs text-primary font-medium">
                    Ver detalles y recomendaciones →
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Información adicional */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="text-2xl">📊</div>
              <h3 className="text-lg font-semibold text-gray-900">Cómo funciona</h3>
            </div>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start space-x-2">
                <span>•</span>
                <span>Analiza la distribución actual de objetos en todos tus cajones</span>
              </li>
              <li className="flex items-start space-x-2">
                <span>•</span>
                <span>Considera la capacidad disponible de cada cajón</span>
              </li>
              <li className="flex items-start space-x-2">
                <span>•</span>
                <span>Genera recomendaciones generales para todo el sistema</span>
              </li>
              <li className="flex items-start space-x-2">
                <span>•</span>
                <span>Utiliza inteligencia artificial para optimizar el espacio</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="text-2xl">🎯</div>
              <h3 className="text-lg font-semibold text-gray-900">Consejos de uso</h3>
            </div>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start space-x-2">
                <span>•</span>
                <span>Revisa las recomendaciones generales aquí</span>
              </li>
              <li className="flex items-start space-x-2">
                <span>•</span>
                <span>Haz clic en un cajón para ver recomendaciones específicas</span>
              </li>
              <li className="flex items-start space-x-2">
                <span>•</span>
                <span>Prueba diferentes tipos de organización</span>
              </li>
              <li className="flex items-start space-x-2">
                <span>•</span>
                <span>Las recomendaciones mejoran con más datos</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </LayoutHome>
  );
};

export default Recomendaciones; 