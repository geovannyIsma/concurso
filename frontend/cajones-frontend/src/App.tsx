import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/home'
import Historial from './pages/historial'
import TiposObjeto from './pages/tipos-objeto'
import CajonDetalle from './pages/cajon-detalle'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/historial" element={<Historial />} />
          <Route path="/tipos-objeto" element={<TiposObjeto />} />
          <Route path="/cajon/:id" element={<CajonDetalle />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App