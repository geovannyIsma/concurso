import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LayoutHome from '../layout/layout_home';
import ObjetosOrdenados from '../components/ObjetosOrdenados';
import { apiService } from '../services/api';
import type { Cajon, Recomendacion } from '../services/api';

const Recomendaciones: React.FC = () => {
  const navigate = useNavigate();
  const [cajones, setCajones] = useState<Cajon[]>([]);
  const [recomendaciones, setRecomendaciones] = useState<string[]>([]);
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

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      const [cajonesData, recomendacionesData, ordenamientoData] = await Promise.all([
        apiService.getCajones(),
        apiService.getRecomendacion(tipoOrdenamiento),
        apiService.getOrdenamiento(tipoOrdenamiento)
      ]);
      setCajones(Array.isArray(cajonesData) ? cajonesData : []);
      setRecomendaciones(recomendacionesData.recomendaciones || []);
      setObjetosOrdenados(ordenamientoData.resultado || []);
    } catch (err) {
      setError('Error al cargar los datos. Por favor, intenta de nuevo.');
      console.error('Error cargando datos:', err);
    } finally {
      setLoading(false);
    }
  };

  const generarNuevaRecomendacion = async () => {
    try {
      setLoading(true);
      const data = await apiService.getRecomendacion(tipoOrdenamiento);
      setRecomendaciones(data.recomendaciones || []);
    } catch (err) {
      setError('Error al generar la recomendación. Por favor, intenta de nuevo.');
      console.error('Error generando recomendación:', err);
    } finally {
      setLoading(false);
    }
  };

  const cambiarOrdenamiento = async (nuevoTipo: string) => {
    try {
      setOrdenamientoLoading(true);
      setTipoOrdenamiento(nuevoTipo);
      const data = await apiService.getOrdenamiento(nuevoTipo);
      setObjetosOrdenados(data.resultado || []);
    } catch (err) {
      console.error('Error cambiando ordenamiento:', err);
      setObjetosOrdenados([]);
    } finally {
      setOrdenamientoLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  if (error) {
    return (
      <LayoutHome>
        <div className="text-center py-8">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={cargarDatos}
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
            <h2 className="text-3xl font-bold text-gray-900">Recomendaciones y Ordenamiento</h2>
            <p className="text-gray-600 mt-1">Organiza tus objetos y obtén recomendaciones inteligentes</p>
          </div>
          <button
            onClick={generarNuevaRecomendacion}
            disabled={loading}
            className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 flex items-center space-x-2"
          >
            <span>🤖</span>
            <span>{loading ? 'Generando...' : 'Nueva Recomendación'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Columna izquierda - Ordenamiento */}
          <div className="space-y-6">
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
                loading={ordenamientoLoading}
              />
            </div>
          </div>

          {/* Columna derecha - Recomendaciones */}
          <div className="space-y-6">
            {/* Recomendaciones IA */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">🤖</div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Recomendaciones de IA
                  </h3>
                </div>
                <span className="text-sm text-gray-500">
                  Basadas en {tipoOrdenamiento}
                </span>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-gray-600">Generando recomendaciones...</p>
                </div>
              ) : recomendaciones.length > 0 ? (
                <div className="space-y-4">
                  {recomendaciones.map((recomendacion, index) => (
                    <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                      <div className="flex items-start space-x-3">
                        <div className="text-lg font-bold text-primary">{index + 1}.</div>
                        <div className="flex-1">
                          <p className="text-gray-900 leading-relaxed">
                            {recomendacion}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🤖</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Sin recomendaciones</h3>
                  <p className="text-gray-500">Genera nuevas recomendaciones para ver sugerencias.</p>
                </div>
              )}
            </div>

            {/* Lista de cajones */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Cajones Disponibles
              </h3>
              <p className="text-gray-600 mb-4">
                Haz clic en un cajón para ver sus detalles y recomendaciones específicas.
              </p>
              
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="h-24 bg-gray-200 rounded-lg"></div>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        Ver detalles →
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Información adicional */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="text-2xl">💡</div>
                <h3 className="text-lg font-semibold text-gray-900">Cómo funciona</h3>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start space-x-2">
                  <span>•</span>
                  <span>El ordenamiento agrupa objetos por criterios específicos</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span>•</span>
                  <span>Las recomendaciones IA sugieren mejoras de organización</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span>•</span>
                  <span>Cambia el tipo de ordenamiento para ver diferentes perspectivas</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span>•</span>
                  <span>Visita cajones específicos para recomendaciones detalladas</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </LayoutHome>
  );
};

export default Recomendaciones; 