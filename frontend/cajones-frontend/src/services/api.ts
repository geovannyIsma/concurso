// Configuración base de la API
const API_BASE_URL = 'http://localhost:8000';

// Interfaces TypeScript basadas en los modelos de Django
export interface Cajon {
  id: number;
  nombre: string;
  capacidad_maxima: number;
  historial: CajonHistorial[];
  objetos: CajonObjeto[];
}

export interface CajonObjeto {
  id: number;
  nombre_objeto: string;
  tipo_objeto: TipoObjeto;
  tamanio: string;
  cajon: number;
}

export interface TipoObjeto {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface CajonHistorial {
  id: number;
  cajon: number;
  fecha: string;
  accion: string;
  descripcion: string;
}

export interface CapacidadCajon {
  cajon_id: number;
  cajon_nombre: string;
  capacidad_maxima: number;
  objetos_actuales: number;
  capacidad_disponible: number;
  porcentaje_ocupacion: number;
}

export interface Recomendacion {
  recomendaciones: string[];
  tipo_ordenamiento: string;
}

// Clase principal de la API
class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  // Método helper para hacer requests
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const response = await fetch(url, { ...defaultOptions, ...options });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // ===== CAJONES =====
  
  // Obtener todos los cajones
  async getCajones(): Promise<Cajon[]> {
    return this.request<Cajon[]>('/api/cajones/');
  }

  // Obtener un cajón específico
  async getCajon(id: number): Promise<Cajon> {
    return this.request<Cajon>(`/api/cajones/${id}/`);
  }

  // Crear un nuevo cajón
  async createCajon(data: { nombre: string; capacidad_maxima: number }): Promise<Cajon> {
    return this.request<Cajon>('/api/cajones/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Actualizar un cajón
  async updateCajon(id: number, data: Partial<Cajon>): Promise<Cajon> {
    return this.request<Cajon>(`/api/cajones/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Eliminar un cajón
  async deleteCajon(id: number): Promise<void> {
    return this.request<void>(`/api/cajones/${id}/`, {
      method: 'DELETE',
    });
  }

  // Obtener capacidad de un cajón
  async getCajonCapacidad(id: number): Promise<CapacidadCajon> {
    return this.request<CapacidadCajon>(`/api/cajones/${id}/capacidad/`);
  }

  // ===== OBJETOS =====

  // Obtener todos los objetos
  async getObjetos(): Promise<CajonObjeto[]> {
    return this.request<CajonObjeto[]>('/api/objetos/');
  }

  // Obtener objetos de un cajón específico
  async getObjetosCajon(cajonId: number): Promise<CajonObjeto[]> {
    return this.request<CajonObjeto[]>(`/api/cajones/${cajonId}/objetos/`);
  }

  // Obtener cajón sin objetos (para optimizar)
  async getCajonBasico(id: number): Promise<Omit<Cajon, 'objetos'>> {
    return this.request<Omit<Cajon, 'objetos'>>(`/api/cajones/${id}/`);
  }

  // Crear un nuevo objeto
  async createObjeto(data: {
    cajon: number;
    nombre_objeto: string;
    tipo_objeto: number;
    tamanio: string;
  }): Promise<CajonObjeto> {
    return this.request<CajonObjeto>('/api/objetos/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Actualizar un objeto
  async updateObjeto(id: number, data: Partial<CajonObjeto>): Promise<CajonObjeto> {
    return this.request<CajonObjeto>(`/api/objetos/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Eliminar un objeto
  async deleteObjeto(id: number): Promise<void> {
    return this.request<void>(`/api/objetos/${id}/`, {
      method: 'DELETE',
    });
  }

  // ===== TIPOS DE OBJETO =====

  // Obtener todos los tipos de objeto
  async getTiposObjeto(): Promise<TipoObjeto[]> {
    return this.request<TipoObjeto[]>('/api/tipos-objeto/');
  }

  // Crear un nuevo tipo de objeto
  async createTipoObjeto(data: { nombre: string; descripcion?: string }): Promise<TipoObjeto> {
    return this.request<TipoObjeto>('/api/tipos-objeto/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Actualizar un tipo de objeto
  async updateTipoObjeto(id: number, data: Partial<TipoObjeto>): Promise<TipoObjeto> {
    return this.request<TipoObjeto>(`/api/tipos-objeto/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Eliminar un tipo de objeto
  async deleteTipoObjeto(id: number): Promise<void> {
    return this.request<void>(`/api/tipos-objeto/${id}/`, {
      method: 'DELETE',
    });
  }

  // ===== HISTORIAL =====

  // Obtener todo el historial
  async getHistorial(): Promise<CajonHistorial[]> {
    return this.request<CajonHistorial[]>('/api/historial/');
  }

  // Obtener historial de un cajón específico
  async getHistorialCajon(cajonId: number): Promise<CajonHistorial[]> {
    return this.request<CajonHistorial[]>(`/api/cajones/${cajonId}/historial/`);
  }

  // ===== ORDENAMIENTO =====

  // Obtener objetos ordenados
  async getOrdenamiento(tipoOrdenamiento: string = 'tipo', cajonId?: number): Promise<any> {
    const params = new URLSearchParams();
    params.append('tipo_ordenamiento', tipoOrdenamiento);
    if (cajonId) {
      params.append('cajon_id', cajonId.toString());
    }
    return this.request<any>(`/api/ordenamiento/?${params.toString()}`);
  }

  // ===== RECOMENDACIONES =====

  // Obtener recomendación de organización
  async getRecomendacion(tipoOrdenamiento: string = 'tipo'): Promise<Recomendacion> {
    return this.request<Recomendacion>(`/api/recomendacion/?tipo_ordenamiento=${tipoOrdenamiento}`);
  }
}

// Instancia singleton de la API
export const apiService = new ApiService();

// Exportar también la clase para testing
export default ApiService;
