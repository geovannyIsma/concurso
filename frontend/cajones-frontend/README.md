# 📦 Aplicación de Gestión de Cajones

Una aplicación moderna para gestionar y organizar objetos en cajones, construida con React, TypeScript y Tailwind CSS.

## 🚀 Características

- **Dashboard intuitivo**: Vista general de todos los cajones con estadísticas
- **Gestión de cajones**: Crear, editar y eliminar cajones
- **Organización de objetos**: Agregar objetos a cajones con diferentes tamaños
- **Sistema de tipos**: Categorizar objetos por tipo
- **Historial de cambios**: Seguimiento de todas las acciones realizadas
- **Interfaz responsive**: Diseño adaptativo para diferentes dispositivos

## 🛠️ Tecnologías Utilizadas

- **React 19** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático para JavaScript
- **Tailwind CSS 4** - Framework de CSS utilitario
- **Vite** - Herramienta de construcción rápida

## 📦 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   └── StatsCard.tsx   # Tarjeta de estadísticas
├── layout/             # Componentes de layout
│   └── layout_home.tsx # Layout principal de la aplicación
├── pages/              # Páginas de la aplicación
│   └── home.tsx        # Página principal
├── styles/             # Estilos globales
│   └── theme.css       # Variables de tema de Tailwind
├── App.tsx             # Componente raíz
└── main.tsx            # Punto de entrada
```

## 🎨 Tema y Colores

La aplicación utiliza un sistema de colores personalizado definido en `src/styles/theme.css`:

- **Primario**: Azul (#1e40af)
- **Secundarios**: Verde, Amarillo, Rojo, Púrpura
- **Neutros**: Escala de grises

## 🚀 Instalación y Uso

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Ejecutar en modo desarrollo**:
   ```bash
   npm run dev
   ```

3. **Construir para producción**:
   ```bash
   npm run build
   ```

## 📱 Funcionalidades Principales

### Dashboard
- Vista general de todos los cajones
- Estadísticas en tiempo real
- Botón para crear nuevos cajones

### Gestión de Cajones
- **Crear cajón**: Define nombre y capacidad máxima
- **Ver detalles**: Información completa del cajón
- **Editar cajón**: Modificar propiedades
- **Eliminar cajón**: Eliminar cajón y sus objetos

### Gestión de Objetos
- **Agregar objeto**: Nombre, tipo y tamaño
- **Categorizar**: Por tipo de objeto
- **Tamaños**: Pequeño, Mediano, Grande
- **Organizar**: Ver objetos por cajón

### Sistema de Tipos
- **Crear tipos**: Categorías personalizadas
- **Gestionar tipos**: Editar y eliminar
- **Asignar tipos**: A objetos específicos

## 🔧 Configuración del Backend

La aplicación está diseñada para trabajar con un backend Django que incluye:

- **Modelos**: Cajon, CajonObjeto, TipoObjeto, CajonHistorial
- **APIs**: Endpoints REST para todas las operaciones
- **Serializers**: Conversión de datos Django a JSON

## 📊 Estadísticas Disponibles

- Total de cajones
- Objetos almacenados
- Ocupación general (%)
- Tipos de objetos únicos
- Ocupación por cajón individual

## 🎯 Próximas Mejoras

- [ ] Integración completa con API Django
- [ ] Sistema de búsqueda y filtros
- [ ] Exportación de datos
- [ ] Notificaciones en tiempo real
- [ ] Modo oscuro
- [ ] PWA (Progressive Web App)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.
