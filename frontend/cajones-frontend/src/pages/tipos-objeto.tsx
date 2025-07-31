import React, { useState, useEffect } from 'react';
import LayoutHome from '../layout/layout_home';
import { apiService } from '../services/api';
import type { TipoObjeto } from '../services/api';

const TiposObjeto: React.FC = () => {
  const [tipos, setTipos] = useState<TipoObjeto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTipo, setEditingTipo] = useState<TipoObjeto | null>(null);
  const [formData, setFormData] = useState({ nombre: '', descripcion: '' });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    cargarTipos();
  }, []);

  const cargarTipos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getTiposObjeto();
      setTipos(data);
    } catch (err) {
      setError('Error al cargar los tipos de objeto. Por favor, intenta de nuevo.');
      console.error('Error cargando tipos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre.trim()) {
      alert('El nombre es requerido');
      return;
    }

    try {
      setFormLoading(true);
      
      if (editingTipo) {
        await apiService.updateTipoObjeto(editingTipo.id, formData);
      } else {
        await apiService.createTipoObjeto(formData);
      }
      
      setShowForm(false);
      setEditingTipo(null);
      setFormData({ nombre: '', descripcion: '' });
      await cargarTipos();
    } catch (err) {
      alert('Error al guardar el tipo de objeto. Por favor, intenta de nuevo.');
      console.error('Error guardando tipo:', err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (tipo: TipoObjeto) => {
    setEditingTipo(tipo);
    setFormData({ nombre: tipo.nombre, descripcion: tipo.descripcion || '' });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este tipo de objeto?')) {
      return;
    }

    try {
      await apiService.deleteTipoObjeto(id);
      await cargarTipos();
    } catch (err) {
      alert('Error al eliminar el tipo de objeto. Por favor, intenta de nuevo.');
      console.error('Error eliminando tipo:', err);
    }
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingTipo(null);
    setFormData({ nombre: '', descripcion: '' });
  };

  if (error) {
    return (
      <LayoutHome>
        <div className="text-center py-8">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={cargarTipos}
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
            <h2 className="text-3xl font-bold text-gray-900">Tipos de Objeto</h2>
            <p className="text-gray-600 mt-1">Gestiona las categorías de objetos disponibles</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
          >
            <span>🏷️</span>
            <span>Nuevo Tipo</span>
          </button>
        </div>

        {/* Formulario */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {editingTipo ? 'Editar Tipo de Objeto' : 'Crear Nuevo Tipo de Objeto'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Tipo
                </label>
                <input
                  type="text"
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ej: Herramienta"
                  disabled={formLoading}
                />
              </div>

              <div>
                <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción (opcional)
                </label>
                <textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Descripción del tipo de objeto..."
                  rows={3}
                  disabled={formLoading}
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={cancelForm}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  disabled={formLoading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md transition-colors duration-200 disabled:opacity-50"
                  disabled={formLoading}
                >
                  {formLoading ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Guardando...
                    </span>
                  ) : (
                    editingTipo ? 'Actualizar' : 'Crear'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de tipos */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Tipos Disponibles ({tipos.length})
            </h3>
          </div>
          
          {loading ? (
            <div className="p-6">
              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="h-16 bg-gray-200 rounded-lg"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : tipos.length === 0 ? (
            <div className="p-6 text-center">
              <div className="text-4xl mb-4">🏷️</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay tipos de objeto</h3>
              <p className="text-gray-500">Crea el primer tipo de objeto para comenzar.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {tipos.map((tipo) => (
                <div key={tipo.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-gray-900">{tipo.nombre}</h4>
                      {tipo.descripcion && (
                        <p className="text-gray-600 mt-1">{tipo.descripcion}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(tipo)}
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors duration-200"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(tipo.id)}
                        className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors duration-200"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </LayoutHome>
  );
};

export default TiposObjeto; 