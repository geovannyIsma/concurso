import React, { useState, useEffect } from 'react';
import type { Cajon } from '../services/api';

interface CajonFormProps {
  cajon?: Cajon | null;
  onSubmit: (data: { nombre: string; capacidad_maxima: number }) => void;
  onCancel: () => void;
  loading?: boolean;
}

const CajonForm: React.FC<CajonFormProps> = ({ cajon, onSubmit, onCancel, loading = false }) => {
  const [nombre, setNombre] = useState('');
  const [capacidadMaxima, setCapacidadMaxima] = useState(10);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (cajon) {
      setNombre(cajon.nombre);
      setCapacidadMaxima(cajon.capacidad_maxima);
    }
  }, [cajon]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (nombre.trim().length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
    }

    if (capacidadMaxima <= 0) {
      newErrors.capacidadMaxima = 'La capacidad debe ser mayor a 0';
    } else if (capacidadMaxima > 1000) {
      newErrors.capacidadMaxima = 'La capacidad no puede ser mayor a 1000';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        nombre: nombre.trim(),
        capacidad_maxima: capacidadMaxima
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        {cajon ? 'Editar Cajón' : 'Crear Nuevo Cajón'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del Cajón
          </label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.nombre ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ej: Cajón de Herramientas"
            disabled={loading}
          />
          {errors.nombre && (
            <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>
          )}
        </div>

        <div>
          <label htmlFor="capacidad" className="block text-sm font-medium text-gray-700 mb-1">
            Capacidad Máxima
          </label>
          <input
            type="number"
            id="capacidad"
            value={capacidadMaxima}
            onChange={(e) => setCapacidadMaxima(parseInt(e.target.value) || 0)}
            min="1"
            max="1000"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.capacidadMaxima ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={loading}
          />
          {errors.capacidadMaxima && (
            <p className="text-red-500 text-sm mt-1">{errors.capacidadMaxima}</p>
          )}
          <p className="text-gray-500 text-sm mt-1">
            Número máximo de objetos que puede contener
          </p>
        </div>

        <div className="flex space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md transition-colors duration-200 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Guardando...
              </span>
            ) : (
              cajon ? 'Actualizar' : 'Crear'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CajonForm; 