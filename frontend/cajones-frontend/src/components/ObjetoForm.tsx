import React, { useState, useEffect } from 'react';
import type { CajonObjeto, TipoObjeto } from '../services/api';

interface ObjetoFormProps {
  cajonId: number;
  tiposObjeto: TipoObjeto[];
  onSubmit: (data: {
    cajon: number;
    nombre_objeto: string;
    tipo_objeto: number;
    tamanio: string;
  }) => void;
  onCancel: () => void;
  loading?: boolean;
}

const ObjetoForm: React.FC<ObjetoFormProps> = ({ 
  cajonId, 
  tiposObjeto, 
  onSubmit, 
  onCancel, 
  loading = false 
}) => {
  const [nombreObjeto, setNombreObjeto] = useState('');
  const [tipoObjetoId, setTipoObjetoId] = useState<number | ''>('');
  const [tamanio, setTamanio] = useState('ME');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const tamanios = [
    { value: 'PE', label: 'Pequeño' },
    { value: 'ME', label: 'Mediano' },
    { value: 'GR', label: 'Grande' }
  ];

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!nombreObjeto.trim()) {
      newErrors.nombreObjeto = 'El nombre del objeto es requerido';
    } else if (nombreObjeto.trim().length < 2) {
      newErrors.nombreObjeto = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!tipoObjetoId) {
      newErrors.tipoObjeto = 'Debe seleccionar un tipo de objeto';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        cajon: cajonId,
        nombre_objeto: nombreObjeto.trim(),
        tipo_objeto: tipoObjetoId as number,
        tamanio
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Agregar Objeto al Cajón
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nombreObjeto" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del Objeto
          </label>
          <input
            type="text"
            id="nombreObjeto"
            value={nombreObjeto}
            onChange={(e) => setNombreObjeto(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.nombreObjeto ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ej: Destornillador"
            disabled={loading}
          />
          {errors.nombreObjeto && (
            <p className="text-red-500 text-sm mt-1">{errors.nombreObjeto}</p>
          )}
        </div>

        <div>
          <label htmlFor="tipoObjeto" className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Objeto
          </label>
          <select
            id="tipoObjeto"
            value={tipoObjetoId}
            onChange={(e) => setTipoObjetoId(e.target.value ? parseInt(e.target.value) : '')}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.tipoObjeto ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={loading}
          >
            <option value="">Seleccionar tipo...</option>
            {tiposObjeto.map((tipo) => (
              <option key={tipo.id} value={tipo.id}>
                {tipo.nombre}
              </option>
            ))}
          </select>
          {errors.tipoObjeto && (
            <p className="text-red-500 text-sm mt-1">{errors.tipoObjeto}</p>
          )}
        </div>

        <div>
          <label htmlFor="tamanio" className="block text-sm font-medium text-gray-700 mb-1">
            Tamaño
          </label>
          <select
            id="tamanio"
            value={tamanio}
            onChange={(e) => setTamanio(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={loading}
          >
            {tamanios.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
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
                Agregando...
              </span>
            ) : (
              'Agregar Objeto'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ObjetoForm; 