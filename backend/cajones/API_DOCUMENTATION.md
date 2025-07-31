# API Documentation - Sistema de Cajones

## Base URL
```
http://localhost:8000
```

## Endpoints

### 1. Cajones

#### Listar todos los cajones
```
GET /api/cajones/
```

**Respuesta:**
```json
[
    {
        "id": 1,
        "nombre": "Cajón A",
        "capacidad_maxima": 10,
        "objetos": [...],
        "historial": [...],
        "objetos_count": 5
    }
]
```

#### Obtener un cajón específico
```
GET /api/cajones/{id}/
```

#### Crear un nuevo cajón
```
POST /api/cajones/
```

**Body:**
```json
{
    "nombre": "Nuevo Cajón",
    "capacidad_maxima": 15
}
```

#### Actualizar un cajón
```
PUT /api/cajones/{id}/
```

#### Eliminar un cajón
```
DELETE /api/cajones/{id}/
```

#### Obtener objetos de un cajón específico
```
GET /api/cajones/{cajon_id}/objetos/
```

#### Obtener historial de un cajón específico
```
GET /api/cajones/{cajon_id}/historial/
```

#### Obtener capacidad disponible de un cajón
```
GET /api/cajones/{cajon_id}/capacidad/
```

**Respuesta:**
```json
{
    "cajon_id": 1,
    "cajon_nombre": "Cajón A",
    "capacidad_maxima": 10,
    "objetos_actuales": 5,
    "capacidad_disponible": 5,
    "porcentaje_ocupacion": 50.0
}
```

### 2. Objetos

#### Listar todos los objetos
```
GET /api/objetos/
```

#### Obtener un objeto específico
```
GET /api/objetos/{id}/
```

#### Crear un nuevo objeto
```
POST /api/objetos/
```

**Body:**
```json
{
    "nombre_objeto": "Libro Python",
    "tipo_objeto": 1,
    "tamanio": "PE",
    "cajon": 1
}
```

#### Actualizar un objeto
```
PUT /api/objetos/{id}/
```

#### Eliminar un objeto
```
DELETE /api/objetos/{id}/
```

### 3. Tipos de Objeto

#### Listar todos los tipos
```
GET /api/tipos-objeto/
```

#### Obtener un tipo específico
```
GET /api/tipos-objeto/{id}/
```

#### Crear un nuevo tipo
```
POST /api/tipos-objeto/
```

**Body:**
```json
{
    "nombre": "Libros",
    "descripcion": "Material de lectura"
}
```

#### Actualizar un tipo
```
PUT /api/tipos-objeto/{id}/
```

#### Eliminar un tipo
```
DELETE /api/tipos-objeto/{id}/
```

### 4. Historial

#### Listar todo el historial
```
GET /api/historial/
```

#### Obtener entrada específica del historial
```
GET /api/historial/{id}/
```

### 5. Recomendaciones

#### Obtener recomendación de organización
```
GET /api/recomendacion/?tipo_ordenamiento=tipo
```

**Parámetros:**
- `tipo_ordenamiento`: 'tipo', 'tamanio', 'mixto' (opcional, por defecto 'tipo')

**Respuesta:**
```json
{
    "mensaje": "Mover libros de cajón A a cajón B para agrupar por tipo"
}
```

## Modelos de Datos

### Cajon
```json
{
    "id": 1,
    "nombre": "string",
    "capacidad_maxima": "integer",
    "objetos": "array",
    "historial": "array",
    "objetos_count": "integer"
}
```

### CajonObjeto
```json
{
    "id": 1,
    "nombre_objeto": "string",
    "tipo_objeto": "integer (ID)",
    "tamanio": "string (PE|ME|GR)",
    "cajon": "integer (ID)"
}
```

### TipoObjeto
```json
{
    "id": 1,
    "nombre": "string",
    "descripcion": "string"
}
```

### CajonHistorial
```json
{
    "id": 1,
    "cajon": "integer (ID)",
    "fecha": "datetime",
    "accion": "string",
    "descripcion": "string"
}
```

## Tamaños de Objetos
- `PE`: Pequeño
- `ME`: Mediano  
- `GR`: Grande

## Códigos de Estado HTTP
- `200`: OK
- `201`: Created
- `204`: No Content
- `400`: Bad Request
- `404`: Not Found
- `500`: Internal Server Error

## Ejemplos de Uso con JavaScript/React

### Obtener todos los cajones
```javascript
const response = await fetch('http://localhost:8000/api/cajones/');
const cajones = await response.json();
```

### Crear un nuevo cajón
```javascript
const response = await fetch('http://localhost:8000/api/cajones/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        nombre: 'Nuevo Cajón',
        capacidad_maxima: 10
    })
});
const nuevoCajon = await response.json();
```

### Obtener recomendación
```javascript
const response = await fetch('http://localhost:8000/api/recomendacion/?tipo_ordenamiento=tipo');
const recomendacion = await response.json();
console.log(recomendacion.mensaje);
```

### Actualizar un objeto
```javascript
const response = await fetch('http://localhost:8000/api/objetos/1/', {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        nombre_objeto: 'Libro Actualizado',
        tipo_objeto: 1,
        tamanio: 'ME',
        cajon: 2
    })
});
const objetoActualizado = await response.json();
```

### Eliminar un cajón
```javascript
const response = await fetch('http://localhost:8000/api/cajones/1/', {
    method: 'DELETE'
});
// No content response
```

## Configuración para Desarrollo

### 1. Instalar dependencias
```bash
pip install -r requirements.txt
```

### 2. Configurar variables de entorno
Crear archivo `.env`:
```
GEMINI_API_KEY=tu_api_key_de_gemini_aqui
```

### 3. Ejecutar migraciones
```bash
python manage.py makemigrations
python manage.py migrate
```

### 4. Crear superusuario (opcional)
```bash
python manage.py createsuperuser
```

### 5. Ejecutar servidor
```bash
python manage.py runserver
```

## Notas Importantes

1. **CORS**: Configurado para permitir todas las origenes en desarrollo
2. **Autenticación**: No requerida para desarrollo (AllowAny)
3. **Historial**: Se crea automáticamente en todas las operaciones CRUD
4. **Validaciones**: Incluidas en el backend
5. **Recomendaciones**: Requieren API key de Gemini configurada 