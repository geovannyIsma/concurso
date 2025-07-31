const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Servicio para Cajones
export const cajonesAPI = {
  // Obtener todos los cajones
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/cajones/`);
    return response.json();
  },

  // Obtener cajón específico
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/cajones/${id}/`);
    return response.json();
  },

  // Crear cajón
  create: async (cajonData) => {
    const response = await fetch(`${API_BASE_URL}/cajones/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cajonData),
    });
    return response.json();
  },

  // Actualizar cajón
  update: async (id, cajonData) => {
    const response = await fetch(`${API_BASE_URL}/cajones/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cajonData),
    });
    return response.json();
  },

  // Eliminar cajón
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/cajones/${id}/`, {
      method: 'DELETE',
    });
    return response.ok;
  },

  // Obtener capacidad del cajón
  getCapacidad: async (id) => {
    const response = await fetch(`${API_BASE_URL}/cajones/${id}/capacidad/`);
    return response.json();
  },
};

// Servicio para Objetos
export const objetosAPI = {
  // Obtener todos los objetos
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/objetos/`);
    return response.json();
  },

  // Obtener objetos de un cajón específico
  getByCajon: async (cajonId) => {
    const response = await fetch(`${API_BASE_URL}/cajones/${cajonId}/objetos/`);
    return response.json();
  },

  // Obtener objetos ordenados de un cajón
  getOrdenados: async (cajonId, ordenamiento = 'creacion') => {
    const response = await fetch(`${API_BASE_URL}/cajones/${cajonId}/objetos-ordenados/?ordenamiento=${ordenamiento}`);
    return response.json();
  },

  // Crear objeto
  create: async (objetoData) => {
    const response = await fetch(`${API_BASE_URL}/objetos/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(objetoData),
    });
    return response.json();
  },

  // Actualizar objeto
  update: async (id, objetoData) => {
    const response = await fetch(`${API_BASE_URL}/objetos/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(objetoData),
    });
    return response.json();
  },

  // Eliminar objeto
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/objetos/${id}/`, {
      method: 'DELETE',
    });
    return response.ok;
  },
};

// Servicio para Tipos de Objeto
export const tiposAPI = {
  // Obtener todos los tipos
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/tipos-objeto/`);
    return response.json();
  },

  // Crear tipo
  create: async (tipoData) => {
    const response = await fetch(`${API_BASE_URL}/tipos-objeto/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tipoData),
    });
    return response.json();
  },
};

// Servicio para Recomendaciones
export const recomendacionesAPI = {
  // Obtener recomendaciones
  getRecomendaciones: async (tipoOrdenamiento = 'tipo') => {
    const response = await fetch(`${API_BASE_URL}/recomendacion/?tipo_ordenamiento=${tipoOrdenamiento}`);
    return response.json();
  },
}; 