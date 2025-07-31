import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  
  const getBreadcrumbItems = () => {
    const pathSegments = location.pathname.split('/').filter(segment => segment);
    
    if (pathSegments.length === 0) {
      return [{ name: 'Inicio', path: '/', current: true }];
    }
    
    const items = [
      { name: 'Inicio', path: '/', current: false }
    ];
    
    pathSegments.forEach((segment, index) => {
      const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
      const isLast = index === pathSegments.length - 1;
      
      let name = '';
      switch (segment) {
        case 'historial':
          name = 'Historial';
          break;
        case 'tipos-objeto':
          name = 'Tipos de Objeto';
          break;
        case 'recomendaciones':
          name = 'Recomendaciones';
          break;
        default:
          name = segment.charAt(0).toUpperCase() + segment.slice(1);
      }
      
      items.push({
        name,
        path,
        current: isLast
      });
    });
    
    return items;
  };
  
  const breadcrumbItems = getBreadcrumbItems();
  
  if (breadcrumbItems.length <= 1) {
    return null;
  }
  
  return (
    <nav className="flex mb-4" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbItems.map((item, index) => (
          <li key={item.path} className="flex items-center">
            {index > 0 && (
              <svg
                className="flex-shrink-0 h-4 w-4 text-gray-400 mx-2"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {item.current ? (
              <span className="text-sm font-medium text-gray-500">
                {item.name}
              </span>
            ) : (
              <Link
                to={item.path}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs; 