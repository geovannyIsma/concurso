import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LayoutHome from '../layout/layout_home';
import ObjetoForm from '../components/ObjetoForm';
import ObjetosOrdenados from '../components/ObjetosOrdenados';
import { apiService } from '../services/api';
import type { Cajon, TipoObjeto, CajonObjeto, Recomendacion } from '../services/api';

const CajonDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cajon, setCajon] = useState<Cajon | null>(null);
  const [tiposObjeto, setTiposObjeto] = useState<TipoObjeto[]>([]);
  const [recomendacion, setRecomendacion] = useState<string>('');
  const [objetosOrdenados, setObjetosOrdenados] = useState<any[]>([]);
  const [showObjetoForm, setShowObjetoForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [ordenamientoLoading, setOrdenamientoLoading] = useState(false);
  const [tipoOrdenamiento, setTipoOrdenamiento] = useState('tipo');

  const tiposOrdenamiento = [
    { value: 'tipo', label: 'Por Tipo de Objeto', description: 'Agrupa objetos por categorías' },
    { value: 'tamanio', label: 'Por Tamaño', description: 'Organiza por tamaño de objetos' }
  ];

  useEffect(() => {
    if (id) {
      cargarDatos();
    }
  }, [id]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [cajonData, objetosData, tiposData, recomendacionData] = await Promise.all([
        apiService.getCajonBasico(parseInt(id!)),
        apiService.getObjetosCajon(parseInt(id!)),
        apiService.getTiposObjeto(),
        apiService.getRecomendacion(tipoOrdenamiento)
      ]);
      
      // Combinar los datos del cajón con sus objetos
      const cajonCompleto = {
        ...cajonData,
        objetos: objetosData
      };
      
      setCajon(cajonCompleto);
      setTiposObjeto(tiposData);
      setRecomendacion(recomendacionData.recomendaciones?.[0] || '');
      
      // Cargar ordenamiento inicial
      await cargarOrdenamiento();
    } catch (err) {
      console.error('Error cargando datos:', err);
      alert('Error al cargar los datos del cajón.');
    } finally {
      setLoading(false);
    }
  };

  const cargarOrdenamiento = async () => {
    try {
      setOrdenamientoLoading(true);
      const data = await apiService.getOrdenamiento(tipoOrdenamiento, parseInt(id!));
      setObjetosOrdenados(data.resultado);
    } catch (err) {
      console.error('Error cargando ordenamiento:', err);
      setObjetosOrdenados([]);
    } finally {
      setOrdenamientoLoading(false);
    }
  };

  const handleCreateObjeto = async (data: {
    cajon: number;
    nombre_objeto: string;
    tipo_objeto: number;
    tamanio: string;
  }) => {
    try {
      setFormLoading(true);
      await apiService.createObjeto(data);
      setShowObjetoForm(false);
      await cargarDatos();
    } catch (err) {
      console.error('Error creando objeto:', err);
      alert('Error al crear el objeto. Por favor, intenta de nuevo.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteObjeto = async (objetoId: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este objeto?')) {
      return;
    }

    try {
      await apiService.deleteObjeto(objetoId);
      await cargarDatos();
    } catch (err) {
      console.error('Error eliminando objeto:', err);
      alert('Error al eliminar el objeto. Por favor, intenta de nuevo.');
    }
  };

  const generarNuevaRecomendacion = async () => {
    try {
      const data = await apiService.getRecomendacion(tipoOrdenamiento);
      setRecomendacion(data.recomendaciones?.[0] || '');
    } catch (err) {
      console.error('Error generando recomendación:', err);
      alert('Error al generar la recomendación.');
    }
  };

  const cambiarOrdenamiento = async (nuevoTipo: string) => {
    setTipoOrdenamiento(nuevoTipo);
    await cargarOrdenamiento();
  };

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

  const getOcupacionPorcentaje = (cajon: Cajon) => {
    return Math.round(((cajon.objetos?.length || 0) / cajon.capacidad_maxima) * 100);
  };

  const getOcupacionColor = (porcentaje: number) => {
    if (porcentaje < 50) return 'bg-green-500';
    if (porcentaje < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <LayoutHome>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </LayoutHome>
    );
  }

  if (!cajon) {
    return (
      <LayoutHome>
        <div className="text-center py-8">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Cajón no encontrado</h3>
          <p className="text-gray-500 mb-4">El cajón que buscas no existe.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            Volver al Inicio
          </button>
        </div>
      </LayoutHome>
    );
  }

  return (
    <LayoutHome>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <button
              onClick={() => navigate('/')}
              className="text-primary hover:text-primary-dark mb-2 flex items-center space-x-2"
            >
              <span>←</span>
              <span>Volver a Cajones</span>
            </button>
            <h2 className="text-3xl font-bold text-gray-900">{cajon.nombre}</h2>
            <p className="text-gray-600 mt-1">Capacidad: {cajon.capacidad_maxima} objetos</p>
          </div>
          <button
            onClick={() => setShowObjetoForm(true)}
            className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
          >
            <span>➕</span>
            <span>Agregar Objeto</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna izquierda - Detalles del cajón */}
          <div className="lg:col-span-1 space-y-6">
            {/* Estadísticas */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas del Cajón</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">{cajon.objetos?.length || 0}</div>
                  <div className="text-sm text-blue-600">Objetos</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">{getOcupacionPorcentaje(cajon)}%</div>
                  <div className="text-sm text-green-600">Ocupación</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {new Set((cajon.objetos || []).map(o => o.tipo_objeto.id)).size}
                  </div>
                  <div className="text-sm text-purple-600">Tipos</div>
                </div>
              </div>

              {/* Barra de ocupación */}
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Ocupación</span>
                  <span>{(cajon.objetos?.length || 0)}/{cajon.capacidad_maxima}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${getOcupacionColor(getOcupacionPorcentaje(cajon))}`}
                    style={{ width: `${Math.min(getOcupacionPorcentaje(cajon), 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Lista de objetos */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Objetos en el Cajón</h3>
              {(cajon.objetos?.length || 0) === 0 ? (
                <p className="text-gray-500 italic">No hay objetos en este cajón</p>
              ) : (
                <div className="space-y-3">
                  {(cajon.objetos || []).map((objeto) => (
                    <div key={objeto.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">📦</span>
                        <div>
                          <p className="font-medium text-gray-900">{objeto.nombre_objeto}</p>
                          <p className="text-sm text-gray-600">{objeto.tipo_objeto.nombre}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTamanioColor(objeto.tamanio)}`}>
                          {getTamanioLabel(objeto.tamanio)}
                        </span>
                        <button
                          onClick={() => handleDeleteObjeto(objeto.id)}
                          className="text-red-500 hover:text-red-700 text-lg"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Columna central - Ordenamiento */}
          <div className="lg:col-span-1 space-y-6">
            {/* Selector de tipo de ordenamiento */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Tipo de Ordenamiento
              </h3>
              
              <div className="space-y-3">
                {tiposOrdenamiento.map((tipo) => (
                  <div
                    key={tipo.value}
                    className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                      tipoOrdenamiento === tipo.value
                        ? 'border-primary bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => cambiarOrdenamiento(tipo.value)}
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
          <div className="lg:col-span-1 space-y-6">
            {/* Recomendación */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">💡</div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Recomendación IA
                  </h3>
                </div>
                <button
                  onClick={generarNuevaRecomendacion}
                  className="bg-primary hover:bg-primary-dark text-white px-3 py-1 rounded-md text-sm transition-colors duration-200"
                >
                  Nueva
                </button>
              </div>

              {recomendacion ? (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">🤖</div>
                    <div className="flex-1">
                      <p className="text-gray-900 leading-relaxed">
                        {recomendacion}
                      </p>
                      <div className="mt-3 flex items-center space-x-2 text-sm text-gray-600">
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

            {/* Información adicional */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="text-2xl">📊</div>
                <h3 className="text-lg font-semibold text-gray-900">Consejos de Organización</h3>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start space-x-2">
                  <span>•</span>
                  <span>Mantén objetos similares juntos</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span>•</span>
                  <span>Usa etiquetas para identificar objetos</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span>•</span>
                  <span>Revisa regularmente el contenido</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span>•</span>
                  <span>No sobrecargues el cajón</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Modal para agregar objeto */}
        {showObjetoForm && (
          <div className="fixed inset-0 bg-black bg-black/50 flex items-center justify-center z-50">
            <ObjetoForm
              cajonId={cajon.id}
              tiposObjeto={tiposObjeto}
              onSubmit={handleCreateObjeto}
              onCancel={() => setShowObjetoForm(false)}
              loading={formLoading}
            />
          </div>
        )}
      </div>
    </LayoutHome>
  );
};

export default CajonDetalle;