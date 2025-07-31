# Sistema de Recomendaciones de Organización con Gemini AI

## Descripción

Este sistema utiliza la API de Gemini AI para generar recomendaciones automáticas de organización de cajones y objetos. El sistema analiza la base de datos de cajones y objetos para sugerir la mejor manera de organizarlos.

## Configuración

### 1. Instalar dependencias
```bash
pip install -r requirements.txt
```

### 2. Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto con:
```
GEMINI_API_KEY=tu_api_key_de_gemini_aqui
```

### 3. Obtener API Key de Gemini
1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crea una nueva API key
3. Copia la key al archivo `.env`

## Endpoints de Recomendación

### 1. Recomendación General
**GET** `/api/recomendacion/?tipo_ordenamiento=tipo`

Genera una recomendación general de organización basada en el tipo de ordenamiento especificado.

**Parámetros:**
- `tipo_ordenamiento`: 'tipo', 'tamanio', 'mixto' (opcional, por defecto 'tipo')

**Respuesta:**
```json
{
    "recomendacion": "Mover libros de cajón A a cajón B para agrupar por tipo",
    "tipo_ordenamiento": "tipo"
}
```

### 2. Recomendación Específica
**POST** `/api/recomendacion/`

Genera una recomendación específica para un cajón u objeto particular.

**Body:**
```json
{
    "cajon_id": 1,
    "objeto_id": null,
    "tipo_ordenamiento": "tipo"
}
```

### 3. Movimientos Sugeridos
**GET** `/api/movimientos-sugeridos/?tipo_ordenamiento=tipo`

Obtiene una lista específica de movimientos sugeridos por Gemini.

**Respuesta:**
```json
{
    "movimientos_sugeridos": "- Mover libro 'Python' de cajón A a cajón B (agrupar por tipo)\n- Mover lápiz de cajón C a cajón A (optimizar espacio)",
    "tipo_ordenamiento": "tipo"
}
```

### 4. Organización Automática
**POST** `/api/organizacion-automatica/?tipo_ordenamiento=tipo`

Obtiene recomendación completa con movimientos sugeridos.

**Body:**
```json
{
    "aplicar_cambios": false
}
```

## Tipos de Ordenamiento

### 1. Por Tipo (`tipo`)
Agrupa objetos por su tipo (libros, herramientas, ropa, etc.)

### 2. Por Tamaño (`tamanio`)
Agrupa objetos por tamaño (pequeño, mediano, grande)

### 3. Mixto (`mixto`)
Combina criterios de tipo y tamaño para optimizar el espacio

## Ejemplos de Uso

### Ejemplo 1: Obtener recomendación general
```bash
curl "http://localhost:8000/api/recomendacion/?tipo_ordenamiento=tipo"
```

### Ejemplo 2: Obtener recomendación para un cajón específico
```bash
curl -X POST "http://localhost:8000/api/recomendacion/" \
     -H "Content-Type: application/json" \
     -d '{"cajon_id": 1, "tipo_ordenamiento": "tipo"}'
```

### Ejemplo 3: Obtener movimientos sugeridos
```bash
curl "http://localhost:8000/api/movimientos-sugeridos/?tipo_ordenamiento=tamanio"
```

## Características del Sistema

1. **Análisis de Contexto**: El sistema analiza toda la base de datos de cajones y objetos
2. **Recomendaciones Inteligentes**: Usa Gemini AI para generar sugerencias contextuales
3. **Límite de Palabras**: Las recomendaciones están limitadas a 30 palabras máximo
4. **Múltiples Criterios**: Soporta diferentes tipos de ordenamiento
5. **Validación de Capacidad**: Considera la capacidad disponible de cada cajón
6. **Historial Automático**: Registra todas las acciones en el historial

## Estructura de Datos Analizada

El sistema analiza:
- **Cajones**: Nombre, capacidad máxima, objetos actuales
- **Objetos**: Nombre, tipo, tamaño, cajón actual
- **Tipos de Objeto**: Categorías y descripciones
- **Capacidad Disponible**: Espacio libre en cada cajón

## Notas Importantes

1. **API Key**: Es obligatorio configurar la API key de Gemini
2. **Límite de Respuesta**: Las recomendaciones están limitadas a 30 palabras
3. **Seguridad**: Los cambios automáticos están deshabilitados por defecto
4. **Contexto Completo**: El sistema considera toda la base de datos para las recomendaciones 