import React, { useState, useEffect } from 'react';
import LayoutHome from '../layout/layout_home';
import StatsCard from '../components/StatsCard';

interface Cajon {
  id: number;
  nombre: string;
  capacidad_maxima: number;
  historial: any[];
  objetos: CajonObjeto[];
}

interface CajonObjeto {
  id: number;
  nombre_objeto: string;
  tipo_objeto: {
    id: number;
    nombre: string;
  };
  tamanio: string;
}

const Home: React.FC = () => {
  const [cajones, setCajones] = useState<Cajon[]>([]);
  const [selectedCajon, setSelectedCajon] = useState<Cajon | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Simular datos de cajones (reemplazar con llamada a API)
  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      const mockCajones: Cajon[] = [
        {
          id: 1,
          nombre: "Cajón de Herramientas",
          capacidad_maxima: 50,
          historial: [],
          objetos: [
            {
              id: 1,
              nombre_objeto: "Destornillador",
              tipo_objeto: { id: 1, nombre: "Herramienta" },
              tamanio: "ME"
            },
            {
              id: 2,
              nombre_objeto: "Martillo",
              tipo_objeto: { id: 1, nombre: "Herramienta" },
              tamanio: "GR"
            }
          ]
        },
        {
          id: 2,
          nombre: "Cajón de Ropa",
          capacidad_maxima: 30,
          historial: [],
          objetos: [
            {
              id: 3,
              nombre_objeto: "Camisa",
              tipo_objeto: { id: 2, nombre: "Ropa" },
              tamanio: "ME"
            }
          ]
        },
        {
          id: 3,
          nombre: "Cajón de Documentos",
          capacidad_maxima: 100,
          historial: [],
          objetos: []
        }
      ];
      setCajones(mockCajones);
      setLoading(false);
    }, 1000);
  }, []);

  const handleCajonClick = (cajon: Cajon) => {
    setSelectedCajon(cajon);
    setShowModal(true);
  };

  const handleCreateCajon = () => {
    // Implementar lógica para crear nuevo cajón
    alert('Función para crear nuevo cajón');
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
    return Math.round((cajon.objetos.length / cajon.capacidad_maxima) * 100);
  };

  const getOcupacionColor = (porcentaje: number) => {
    if (porcentaje < 50) return 'bg-green-500';
    if (porcentaje < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Calcular estadísticas generales
  const totalObjetos = cajones.reduce((sum, cajon) => sum + cajon.objetos.length, 0);
  const totalCapacidad = cajones.reduce((sum, cajon) => sum + cajon.capacidad_maxima, 0);
  const ocupacionGeneral = totalCapacidad > 0 ? Math.round((totalObjetos / totalCapacidad) * 100) : 0;
  const tiposUnicos = new Set(cajones.flatMap(cajon => cajon.objetos.map(obj => obj.tipo_objeto.id))).size;

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
            onClick={handleCreateCajon}
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
            value={cajones.length}
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
          {cajones.map((cajon) => (
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
                  <span>{cajon.objetos.length}/{cajon.capacidad_maxima}</span>
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
                {cajon.objetos.slice(0, 3).map((objeto) => (
                  <div key={objeto.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 truncate">{objeto.nombre_objeto}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTamanioColor(objeto.tamanio)}`}>
                      {getTamanioLabel(objeto.tamanio)}
                    </span>
                  </div>
                ))}
                {cajon.objetos.length === 0 && (
                  <p className="text-sm text-gray-400 italic">Sin objetos</p>
                )}
                {cajon.objetos.length > 3 && (
                  <p className="text-sm text-primary font-medium">
                    +{cajon.objetos.length - 3} más
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Modal de detalles */}
        {showModal && selectedCajon && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{selectedCajon.nombre}</h3>
                    <p className="text-gray-600">Capacidad: {selectedCajon.capacidad_maxima} objetos</p>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>

                {/* Estadísticas */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">{selectedCajon.objetos.length}</div>
                    <div className="text-sm text-blue-600">Objetos</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">{getOcupacionPorcentaje(selectedCajon)}%</div>
                    <div className="text-sm text-green-600">Ocupación</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {new Set(selectedCajon.objetos.map(o => o.tipo_objeto.id)).size}
                    </div>
                    <div className="text-sm text-purple-600">Tipos</div>
                  </div>
                </div>

                {/* Lista de objetos */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Objetos en el cajón</h4>
                  {selectedCajon.objetos.length === 0 ? (
                    <p className="text-gray-500 italic">No hay objetos en este cajón</p>
                  ) : (
                    <div className="space-y-3">
                      {selectedCajon.objetos.map((objeto) => (
                        <div key={objeto.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <span className="text-lg">📦</span>
                            <div>
                              <p className="font-medium text-gray-900">{objeto.nombre_objeto}</p>
                              <p className="text-sm text-gray-600">{objeto.tipo_objeto.nombre}</p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTamanioColor(objeto.tamanio)}`}>
                            {getTamanioLabel(objeto.tamanio)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Botones de acción */}
                <div className="flex space-x-3 mt-6 pt-6 border-t border-gray-200">
                  <button className="flex-1 bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-lg transition-colors duration-200">
                    Agregar Objeto
                  </button>
                  <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition-colors duration-200">
                    Editar Cajón
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </LayoutHome>
  );
};

export default Home;
