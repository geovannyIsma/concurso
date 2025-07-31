import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { cajonesAPI, objetosAPI, tiposAPI, recomendacionesAPI } from '../services/api';
import './CajonDetalle.css';

const CajonDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Estados
  const [cajon, setCajon] = useState(null);
  const [objetos, setObjetos] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [ordenamiento, setOrdenamiento] = useState('creacion');
  const [recomendaciones, setRecomendaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRecomendaciones, setShowRecomendaciones] = useState(false);
  const [showAddObject, setShowAddObject] = useState(false);
  const [newObject, setNewObject] = useState({
    nombre_objeto: '',
    tipo_objeto: '',
    tamanio: 'PE'
  });

  // Cargar datos iniciales
  useEffect(() => {
    loadData();
  }, [id]);

  // Cargar objetos cuando cambie el ordenamiento
  useEffect(() => {
    if (id) {
      loadObjetosOrdenados();
    }
  }, [id, ordenamiento]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [cajonData, tiposData] = await Promise.all([
        cajonesAPI.getById(id),
        tiposAPI.getAll()
      ]);
      
      setCajon(cajonData);
      setTipos(tiposData);
      await loadObjetosOrdenados();
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadObjetosOrdenados = async () => {
    try {
      const data = await objetosAPI.getOrdenados(id, ordenamiento);
      setObjetos(data.objetos || []);
    } catch (error) {
      console.error('Error cargando objetos:', error);
    }
  };

  const handleOrdenamientoChange = (nuevoOrdenamiento) => {
    setOrdenamiento(nuevoOrdenamiento);
  };

  const handleGetRecomendaciones = async () => {
    try {
      setShowRecomendaciones(true);
      const data = await recomendacionesAPI.getRecomendaciones(ordenamiento);
      setRecomendaciones(data.recomendaciones || []);
    } catch (error) {
      console.error('Error obteniendo recomendaciones:', error);
      setRecomendaciones(['Error al generar recomendaciones']);
    }
  };

  const handleAddObject = async (e) => {
    e.preventDefault();
    try {
      await objetosAPI.create({
        ...newObject,
        cajon: parseInt(id)
      });
      setNewObject({ nombre_objeto: '', tipo_objeto: '', tamanio: 'PE' });
      setShowAddObject(false);
      await loadObjetosOrdenados();
    } catch (error) {
      console.error('Error agregando objeto:', error);
    }
  };

  const handleDeleteObject = async (objetoId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este objeto?')) {
      try {
        await objetosAPI.delete(objetoId);
        await loadObjetosOrdenados();
      } catch (error) {
        console.error('Error eliminando objeto:', error);
      }
    }
  };

  const getTamanioColor = (tamanio) => {
    switch (tamanio) {
      case 'PE': return 'green';
      case 'ME': return 'orange';
      case 'GR': return 'red';
      default: return 'gray';
    }
  };

  const getTamanioText = (tamanio) => {
    switch (tamanio) {
      case 'PE': return 'Pequeño';
      case 'ME': return 'Mediano';
      case 'GR': return 'Grande';
      default: return tamanio;
    }
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  if (!cajon) {
    return <div className="error">Cajón no encontrado</div>;
  }

  const ocupacion = (objetos.length / cajon.capacidad_maxima) * 100;
  const tiposUnicos = [...new Set(objetos.map(obj => obj.tipo_objeto))].length;

  return (
    <div className="cajon-detalle">
      {/* Header */}
      <div className="header">
        <div className="breadcrumbs">
          Inicio > Detalle del Cajón > {id}
        </div>
        <button 
          className="back-button"
          onClick={() => navigate('/cajones')}
        >
          ← Volver a Cajones
        </button>
        
        <h1>{cajon.nombre}</h1>
        <p>Capacidad: {cajon.capacidad_maxima} objetos</p>
        
        <button 
          className="add-object-btn"
          onClick={() => setShowAddObject(true)}
        >
          + Agregar Objeto
        </button>
      </div>

      <div className="content-grid">
        {/* Columna Izquierda */}
        <div className="left-column">
          {/* Estadísticas */}
          <div className="stats-panel">
            <h3>Estadísticas del Cajón</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-number blue">{objetos.length}</div>
                <div className="stat-label">Objetos</div>
              </div>
              <div className="stat-item">
                <div className="stat-number green">{ocupacion.toFixed(0)}%</div>
                <div className="stat-label">Ocupación</div>
              </div>
              <div className="stat-item">
                <div className="stat-number purple">{tiposUnicos}</div>
                <div className="stat-label">Tipos</div>
              </div>
            </div>
            <div className="ocupacion-bar">
              <div className="ocupacion-label">Ocupación</div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${ocupacion}%` }}
                ></div>
              </div>
              <div className="ocupacion-text">{objetos.length}/{cajon.capacidad_maxima}</div>
            </div>
          </div>

          {/* Objetos en el Cajón */}
          <div className="objects-panel">
            <h3>Objetos en el Cajón</h3>
            <div className="objects-list">
              {objetos.map((objeto) => (
                <div key={objeto.id} className="object-item">
                  <div className="object-icon">📦</div>
                  <div className="object-info">
                    <div className="object-name">{objeto.nombre_objeto}</div>
                    <div className="object-details">
                      <span className={`tamanio-tag ${getTamanioColor(objeto.tamanio)}`}>
                        {getTamanioText(objeto.tamanio)}
                      </span>
                    </div>
                  </div>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteObject(objeto.id)}
                  >
                    🗑️
                  </button>
                </div>
              ))}
              {objetos.length === 0 && (
                <div className="empty-state">No hay objetos en este cajón</div>
              )}
            </div>
          </div>
        </div>

        {/* Columna Central */}
        <div className="center-column">
          {/* Tipo de Ordenamiento */}
          <div className="ordenamiento-panel">
            <h3>Tipo de Ordenamiento</h3>
            <div className="ordenamiento-options">
              <label className="radio-option">
                <input
                  type="radio"
                  name="ordenamiento"
                  value="creacion"
                  checked={ordenamiento === 'creacion'}
                  onChange={(e) => handleOrdenamientoChange(e.target.value)}
                />
                <div className="option-content">
                  <div className="option-title">Por Creación</div>
                  <div className="option-description">Orden original de creación</div>
                </div>
              </label>
              
              <label className="radio-option">
                <input
                  type="radio"
                  name="ordenamiento"
                  value="tipo"
                  checked={ordenamiento === 'tipo'}
                  onChange={(e) => handleOrdenamientoChange(e.target.value)}
                />
                <div className="option-content">
                  <div className="option-title">Por Tipo de Objeto</div>
                  <div className="option-description">Agrupa objetos por categorías</div>
                </div>
              </label>
              
              <label className="radio-option">
                <input
                  type="radio"
                  name="ordenamiento"
                  value="tamanio"
                  checked={ordenamiento === 'tamanio'}
                  onChange={(e) => handleOrdenamientoChange(e.target.value)}
                />
                <div className="option-content">
                  <div className="option-title">Por Tamaño</div>
                  <div className="option-description">Organiza por tamaño de objetos</div>
                </div>
              </label>
            </div>
          </div>

          {/* Objetos Ordenados */}
          <div className="objetos-ordenados-panel">
            <h3>
              Objetos Ordenados: {ordenamiento === 'creacion' ? 'Creación' : 
                                 ordenamiento === 'tipo' ? 'Tipo' : 'Tamaño'}
            </h3>
            <div className="objetos-ordenados-list">
              {objetos.map((objeto, index) => (
                <div key={objeto.id} className="objeto-ordenado-item">
                  <div className="objeto-icon">📦</div>
                  <div className="objeto-info">
                    <div className="objeto-name">{objeto.nombre_objeto}</div>
                    <div className="objeto-details">
                      <span>Cajón: {objeto.cajon}</span>
                      <span className={`tamanio-tag ${getTamanioColor(objeto.tamanio)}`}>
                        {getTamanioText(objeto.tamanio)}
                      </span>
                    </div>
                  </div>
                  <div className="objeto-index">{index + 1}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Columna Derecha */}
        <div className="right-column">
          {/* Recomendación IA */}
          <div className="recomendacion-panel">
            <div className="panel-header">
              <h3>Recomendación IA</h3>
              <button 
                className="nueva-btn"
                onClick={handleGetRecomendaciones}
              >
                Nueva
              </button>
            </div>
            
            {showRecomendaciones && (
              <div className="recomendaciones-content">
                {recomendaciones.map((recomendacion, index) => (
                  <div key={index} className="recomendacion-item">
                    <span className="recomendacion-number">{index + 1}.</span>
                    <span className="recomendacion-text">{recomendacion}</span>
                  </div>
                ))}
                <div className="ai-badge">
                  💡 Recomendación generada con IA
                </div>
              </div>
            )}
          </div>

          {/* Consejos de Organización */}
          <div className="consejos-panel">
            <h3>Consejos de Organización</h3>
            <ul className="consejos-list">
              <li>Mantén objetos similares juntos</li>
              <li>Usa etiquetas para identificar objetos</li>
              <li>Revisa regularmente el contenido</li>
              <li>No sobrecargues el cajón</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Modal para Agregar Objeto */}
      {showAddObject && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Agregar Nuevo Objeto</h3>
            <form onSubmit={handleAddObject}>
              <div className="form-group">
                <label>Nombre del Objeto:</label>
                <input
                  type="text"
                  value={newObject.nombre_objeto}
                  onChange={(e) => setNewObject({...newObject, nombre_objeto: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Tipo de Objeto:</label>
                <select
                  value={newObject.tipo_objeto}
                  onChange={(e) => setNewObject({...newObject, tipo_objeto: e.target.value})}
                  required
                >
                  <option value="">Seleccionar tipo</option>
                  {tipos.map(tipo => (
                    <option key={tipo.id} value={tipo.id}>
                      {tipo.nombre}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Tamaño:</label>
                <select
                  value={newObject.tamanio}
                  onChange={(e) => setNewObject({...newObject, tamanio: e.target.value})}
                  required
                >
                  <option value="PE">Pequeño</option>
                  <option value="ME">Mediano</option>
                  <option value="GR">Grande</option>
                </select>
              </div>
              
              <div className="modal-buttons">
                <button type="submit" className="btn-primary">
                  Agregar
                </button>
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setShowAddObject(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CajonDetalle;