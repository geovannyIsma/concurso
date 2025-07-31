import React from 'react';
import { Link } from 'react-router-dom';
import LayoutHome from '../layout/layout_home';

const NotFound: React.FC = () => {
  return (
    <LayoutHome>
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl font-bold text-gray-200 mb-4">404</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Página no encontrada
          </h1>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </p>
          
          <div className="space-y-4">
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors duration-200"
            >
              <span className="mr-2">🏠</span>
              Volver al Inicio
            </Link>
            
            <div className="text-sm text-gray-500">
              O navega a una de estas páginas:
            </div>
            
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/historial"
                className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors duration-200"
              >
                <span className="mr-2">📋</span>
                Historial
              </Link>
              <Link
                to="/tipos-objeto"
                className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors duration-200"
              >
                <span className="mr-2">🏷️</span>
                Tipos de Objeto
              </Link>
              <Link
                to="/recomendaciones"
                className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors duration-200"
              >
                <span className="mr-2">🤖</span>
                Recomendaciones
              </Link>
            </div>
          </div>
        </div>
      </div>
    </LayoutHome>
  );
};

export default NotFound; 