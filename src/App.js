import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import MyNavbar from './components/navbar'

import Inicio from './components/Inicio'
import Inventario from './components/Inventario'
import InventarioInstrumentos from './components/InventarioInstrumentos'
import InventarioProyectores from './components/InventarioProyectores'
import InventarioNotebooks from './components/InventarioNotebooks'
import InventarioLibros from './components/InventarioLibros'

function App() {
  return (
    <main className='App'>
      <Router>
          <MyNavbar />
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/inventario" element={<Inventario />} />
            <Route path="/instrumentos" element={<InventarioInstrumentos />} />
            <Route path="/proyectores" element={<InventarioProyectores />} />
            <Route path="/notebooks" element={<InventarioNotebooks />} />
            <Route path="/libros" element={<InventarioLibros />} />
          </Routes>
      </Router>
    </main>
  );
}

export default App;