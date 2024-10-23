import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './index.css'; 
import MyNavbar from './components/navbar';
import Inicio from './components/Inicio';
import Login from './components/Login';
import InventarioInstrumentos from './components/InventarioInstrumentos';
import InventarioProyectores from './components/InventarioProyectores';
import InventarioNotebooks from './components/InventarioNotebooks';
import InventarioLibros from './components/InventarioLibros';
import ReservaProyector from './components/ReservaProyector'; // Importa el nuevo componente

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null);

  return (
    <main className='App'>
      <Router>
        <MyNavbar />
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/instrumentos" element={<InventarioInstrumentos />} />
          <Route path="/proyectores" element={<InventarioProyectores />} />
          <Route path="/notebooks" element={<InventarioNotebooks />} />
          <Route path="/libros" element={<InventarioLibros />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setUserType={setUserType} />} />
          <Route path="/reserva-proyector" element={<ReservaProyector />} /> {/* Agrega la nueva ruta */}
        </Routes>
      </Router>
    </main>
  );
}

export default App;
