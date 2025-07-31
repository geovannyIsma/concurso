import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LayoutHome from '../layout/layout_home';
import StatsCard from '../components/StatsCard';
import CajonForm from '../components/CajonForm';
import { apiService } from '../services/api';
import type { Cajon, TipoObjeto } from '../services/api';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [cajones, setCajones] = useState<Cajon[]>([]);
  const [tiposObjeto, setTiposObjeto] = useState<TipoObjeto[]>([]);
  const [showCajonForm, setShowCajonForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [cajonesData, tiposData] = await Promise.all([
        apiService.getCajones(),
        apiService.getTiposObjeto()
      ]);
      setCajones(Array.isArray(cajonesData) ? cajonesData : []);
      setTiposObjeto(Array.isArray(tiposData) ? tiposData : []);
    } catch (err) {
      console.error('Error cargando datos:', err);
      alert('Error al cargar los datos. Por favor, verifica que el backend esté ejecutándose.');
      // Establecer arrays vacíos en caso de error
      setCajones([]);
      setTiposObjeto([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCajonClick = (cajon: Cajon) => {
    navigate(`/cajon/${cajon.id}`);
  };

  const handleCreateCajon = async (data: { nombre: string; capacidad_maxima: number }) => {
    try {
      setFormLoading(true);
      await apiService.createCajon(data);
      setShowCajonForm(false);
      await cargarDatos();
    } catch (err) {
      console.error('Error creando cajón:', err);
      alert('Error al crear el cajón. Por favor, intenta de nuevo.');
    } finally {
      setFormLoading(false);
    }
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

  // Calcular estadísticas generales
  const cajonesArray = Array.isArray(cajones) ? cajones : [];
  const totalObjetos = cajonesArray.reduce((sum, cajon) => sum + (cajon.objetos?.length || 0), 0);
  const totalCapacidad = cajonesArray.reduce((sum, cajon) => sum + cajon.capacidad_maxima, 0);
  const ocupacionGeneral = totalCapacidad > 0 ? Math.round((totalObjetos / totalCapacidad) * 100) : 0;
  const tiposUnicos = new Set(
    cajonesArray.flatMap(cajon => 
      cajon.objetos?.map(obj => obj.tipo_objeto.id) || []
    )
  ).size;

  if (loading) {
    return (
      <LayoutHome>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </LayoutHome>
    );
  }

  return (
    <LayoutHome>
      <div className="space-y-6">
        {/* Header de la página */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Mis Cajones</h2>
            <p className="text-gray-600 mt-1">Gestiona y organiza tus objetos</p>
          </div>
          <button
            onClick={() => setShowCajonForm(true)}
            className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
          >
            <span>📦</span>
            <span>Crear Nuevo Cajón</span>
          </button>
        </div>

        {/* Estadísticas generales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total de Cajones"
            value={cajonesArray.length}
            icon="📦"
            color="blue"
            description="Cajones disponibles"
          />
          <StatsCard
            title="Objetos Totales"
            value={totalObjetos}
            icon="🔧"
            color="green"
            description="Objetos almacenados"
          />
          <StatsCard
            title="Ocupación General"
            value={`${ocupacionGeneral}%`}
            icon="📊"
            color="purple"
            description="Capacidad utilizada"
          />
          <StatsCard
            title="Tipos de Objetos"
            value={tiposUnicos}
            icon="🏷️"
            color="yellow"
            description="Categorías únicas"
          />
        </div>

        {/* Grid de cajones */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cajonesArray.map((cajon) => (
            <div
              key={cajon.id}
              onClick={() => handleCajonClick(cajon)}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow duration-200 hover:border-primary-light"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {cajon.nombre}
                </h3>
                <span className="text-2xl">📦</span>
              </div>

              {/* Barra de ocupación */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Ocupación</span>
                  <span>{(cajon.objetos?.length || 0)}/{cajon.capacidad_maxima}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getOcupacionColor(getOcupacionPorcentaje(cajon))}`}
                    style={{ width: `${Math.min(getOcupacionPorcentaje(cajon), 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Objetos recientes */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Objetos recientes:</p>
                {(cajon.objetos || []).slice(0, 3).map((objeto) => (
                  <div key={objeto.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 truncate">{objeto.nombre_objeto}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTamanioColor(objeto.tamanio)}`}>
                      {getTamanioLabel(objeto.tamanio)}
                    </span>
                  </div>
                ))}
                {(cajon.objetos?.length || 0) === 0 && (
                  <p className="text-sm text-gray-400 italic">Sin objetos</p>
                )}
                {(cajon.objetos?.length || 0) > 3 && (
                  <p className="text-sm text-primary font-medium">
                    +{(cajon.objetos?.length || 0) - 3} más
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Modal para crear cajón */}
        {showCajonForm && (
          <div className="fixed inset-0 bg-black bg-black/50 flex items-center justify-center z-50">
            <CajonForm
              onSubmit={handleCreateCajon}
              onCancel={() => setShowCajonForm(false)}
              loading={formLoading}
            />
          </div>
        )}
      </div>
    </LayoutHome>
  );
};

export default Home;
