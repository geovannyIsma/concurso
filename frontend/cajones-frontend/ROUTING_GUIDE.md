# 🧭 Guía de Enrutamiento - React Router

## 📋 Descripción General

Se ha implementado un sistema de enrutamiento completo usando React Router v6 para la aplicación de Gestión de Cajones. El enrutamiento permite navegar entre diferentes páginas sin recargar la aplicación.

## 🛠️ Instalación

Si aún no tienes React Router instalado, ejecuta:

```bash
npm install react-router-dom @types/react-router-dom
```

## 🗺️ Estructura de Rutas

### Rutas Principales

| Ruta | Componente | Descripción |
|------|------------|-------------|
| `/` | `Home` | Página principal - Gestión de cajones |
| `/historial` | `Historial` | Historial de actividades |
| `/tipos-objeto` | `TiposObjeto` | Gestión de tipos de objeto |
| `/recomendaciones` | `Recomendaciones` | Recomendaciones IA |
| `*` | `NotFound` | Página 404 - Rutas no encontradas |

## 🎨 Componentes de Navegación

### 1. Layout Principal (`layout_home.tsx`)
- **Sidebar de navegación** con enlaces a todas las páginas
- **Indicador de página activa** con estilos diferenciados
- **Breadcrumbs** para mostrar la ubicación actual
- **Navegación móvil** para dispositivos pequeños

### 2. Breadcrumbs (`Breadcrumbs.tsx`)
- Muestra la ruta actual de navegación
- Enlaces para volver a páginas anteriores
- Se oculta automáticamente en la página principal

### 3. Navegación Móvil (`MobileNav.tsx`)
- Botón flotante para abrir menú en móviles
- Menú desplegable con todas las opciones
- Overlay para cerrar el menú

### 4. Navegación Rápida (`QuickNav.tsx`)
- Componente opcional para navegación rápida
- Grid de tarjetas con todas las páginas
- Indicadores visuales de página activa

## 🔧 Hook de Navegación

### useNavigation Hook

```typescript
import { useNavigation } from '../hooks/useNavigation';

const MyComponent = () => {
  const { 
    goTo, 
    goBack, 
    goHome, 
    goToHistorial,
    goToTiposObjeto,
    goToRecomendaciones,
    isCurrentPath,
    currentPath 
  } = useNavigation();

  // Navegar programáticamente
  const handleClick = () => {
    goTo('/historial');
  };

  // Verificar página actual
  if (isCurrentPath('/')) {
    console.log('Estamos en la página principal');
  }

  return (
    <div>
      <button onClick={goHome}>Ir al Inicio</button>
      <button onClick={goBack}>Volver</button>
    </div>
  );
};
```

## 📱 Características Responsive

### Desktop (lg y superior)
- **Sidebar fijo** con navegación completa
- **Breadcrumbs** visibles
- **Navegación móvil** oculta

### Móvil/Tablet (menor a lg)
- **Sidebar oculto** para ahorrar espacio
- **Navegación móvil** con botón flotante
- **Menú desplegable** con overlay

## 🎯 Uso de Componentes

### Navegación Básica

```tsx
import { Link } from 'react-router-dom';

// Enlace simple
<Link to="/historial">Ver Historial</Link>

// Enlace con estilos
<Link 
  to="/tipos-objeto"
  className="bg-primary text-white px-4 py-2 rounded"
>
  Tipos de Objeto
</Link>
```

### Navegación Programática

```tsx
import { useNavigate } from 'react-router-dom';

const MyComponent = () => {
  const navigate = useNavigate();

  const handleSubmit = () => {
    // Hacer algo...
    navigate('/historial'); // Navegar después de completar
  };

  return <button onClick={handleSubmit}>Enviar</button>;
};
```

### Verificar Página Actual

```tsx
import { useLocation } from 'react-router-dom';

const MyComponent = () => {
  const location = useLocation();
  
  if (location.pathname === '/') {
    return <div>Estás en la página principal</div>;
  }
  
  return <div>Estás en otra página</div>;
};
```

## 🎨 Estilos y Temas

### Estados de Navegación

```css
/* Página activa */
.active {
  @apply text-primary bg-primary-50;
}

/* Página inactiva */
.inactive {
  @apply text-gray-600 hover:bg-gray-50 hover:text-gray-900;
}

/* Hover effects */
.nav-link {
  @apply transition-colors duration-200;
}
```

### Indicadores Visuales

- **Página activa**: Fondo azul claro, texto azul
- **Hover**: Cambio de color suave
- **Transiciones**: Animaciones de 200ms
- **Iconos**: Emojis para mejor UX

## 🔄 Flujo de Navegación

1. **Usuario hace clic** en enlace de navegación
2. **React Router** intercepta la navegación
3. **Componente correspondiente** se renderiza
4. **URL se actualiza** sin recargar la página
5. **Estado de navegación** se actualiza
6. **Breadcrumbs y navegación** reflejan la nueva ubicación

## 🚀 Mejoras Futuras

### Posibles Extensiones

1. **Navegación con parámetros**:
   ```tsx
   <Route path="/cajon/:id" element={<CajonDetail />} />
   ```

2. **Navegación anidada**:
   ```tsx
   <Route path="/admin" element={<AdminLayout />}>
     <Route path="users" element={<Users />} />
     <Route path="settings" element={<Settings />} />
   </Route>
   ```

3. **Guards de navegación**:
   ```tsx
   const ProtectedRoute = ({ children }) => {
     const isAuthenticated = useAuth();
     return isAuthenticated ? children : <Navigate to="/login" />;
   };
   ```

4. **Lazy loading**:
   ```tsx
   const LazyComponent = lazy(() => import('./LazyComponent'));
   ```

## 🐛 Solución de Problemas

### Error: "Cannot read properties of undefined (reading 'map')"
- **Causa**: React Router no está instalado
- **Solución**: Instalar `react-router-dom`

### Error: "useNavigate() may be used only in the context of a Router"
- **Causa**: Componente usado fuera del Router
- **Solución**: Asegurar que el componente esté dentro de `<Router>`

### Navegación no funciona
- **Causa**: Rutas mal configuradas
- **Solución**: Verificar que las rutas estén correctamente definidas en `App.tsx`

## 📚 Recursos Adicionales

- [React Router Documentation](https://reactrouter.com/)
- [React Router Tutorial](https://reactrouter.com/en/main/start/tutorial)
- [React Router Examples](https://github.com/remix-run/react-router/tree/main/examples)

---

¡El enrutamiento está completamente configurado y listo para usar! 🚀 