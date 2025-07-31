import React from 'react';

interface LayoutHomeProps {
  children: React.ReactNode;
}

const LayoutHome: React.FC<LayoutHomeProps> = ({ children }) => {
  const isActive = (path: string) => {
    return window.location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
                          <div className="flex items-center">
                <div className="flex-shrink-0">
                  <h1 className="text-2xl font-bold text-white">
                    📦 Gestión de Cajones
                  </h1>
                </div>
              </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
          <nav className="mt-8">
            <div className="px-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Navegación
              </h3>
              <div className="mt-4 space-y-2">
                <a 
                  href="/" 
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    isActive('/') 
                      ? 'text-primary bg-primary-50' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className="mr-3">📦</span>
                  Cajones
                </a>
                <a 
                  href="/historial" 
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    isActive('/historial') 
                      ? 'text-primary bg-primary-50' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className="mr-3">📋</span>
                  Historial
                </a>
                <a 
                  href="/tipos-objeto" 
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    isActive('/tipos-objeto') 
                      ? 'text-primary bg-primary-50' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className="mr-3">🏷️</span>
                  Tipos de Objetos
                </a>
                <a 
                  href="/recomendaciones" 
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    isActive('/recomendaciones') 
                      ? 'text-primary bg-primary-50' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className="mr-3">🤖</span>
                  Recomendaciones
                </a>
              </div>
            </div>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default LayoutHome;
