import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const QuickNav: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', name: 'Cajones', icon: '📦', description: 'Gestionar cajones' },
    { path: '/historial', name: 'Historial', icon: '📋', description: 'Ver actividades' },
    { path: '/tipos-objeto', name: 'Tipos', icon: '🏷️', description: 'Categorías' },
    { path: '/recomendaciones', name: 'IA', icon: '🤖', description: 'Recomendaciones' }
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Navegación Rápida</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`p-3 rounded-lg text-center transition-all duration-200 ${
              isActive(item.path)
                ? 'bg-primary text-white shadow-md'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-sm'
            }`}
          >
            <div className="text-2xl mb-1">{item.icon}</div>
            <div className="text-xs font-medium">{item.name}</div>
            <div className={`text-xs mt-1 ${
              isActive(item.path) ? 'text-white/80' : 'text-gray-500'
            }`}>
              {item.description}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickNav; 