import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CajonDetalle from './components/CajonDetalle';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Sistema de Cajones</h1>
          <nav>
            <Link to="/" className="nav-link">Inicio</Link>
            <Link to="/cajones" className="nav-link">Cajones</Link>
          </nav>
        </header>
        
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cajones" element={<CajonesList />} />
            <Route path="/cajones/:id" element={<CajonDetalle />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

// Componente Home
function Home() {
  return (
    <div className="home">
      <h2>Bienvenido al Sistema de Cajones</h2>
      <p>Gestiona y organiza tus objetos de manera inteligente</p>
      <Link to="/cajones" className="btn-primary">
        Ver Cajones
      </Link>
    </div>
  );
}

// Componente CajonesList (simplificado)
function CajonesList() {
  return (
    <div className="cajones-list">
      <h2>Lista de Cajones</h2>
      <div className="cajones-grid">
        <Link to="/cajones/1" className="cajon-card">
          <h3>Cajón de Herramientas</h3>
          <p>Capacidad: 10 objetos</p>
          <span className="ocupacion">2/10 objetos</span>
        </Link>
        <Link to="/cajones/2" className="cajon-card">
          <h3>Cajón de Oficina</h3>
          <p>Capacidad: 15 objetos</p>
          <span className="ocupacion">5/15 objetos</span>
        </Link>
        <Link to="/cajones/3" className="cajon-card">
          <h3>Cajón de Cocina</h3>
          <p>Capacidad: 20 objetos</p>
          <span className="ocupacion">8/20 objetos</span>
        </Link>
      </div>
    </div>
  );
}

export default App;
