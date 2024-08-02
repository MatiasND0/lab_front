import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import MyNavbar from './components/navbar';
import { AuthProvider } from './components/AuthContext';

import Inicio from './components/Inicio'
import Inventario from './components/Inventario'
import Admin from './components/Admin'

function App() {
  return (
    <Router>
      <AuthProvider>
        <MyNavbar />
        <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/inventario" element={<Inventario />} />
            <Route path="/admin" element={<Admin />} />
        </Routes>
        </AuthProvider>
    </Router>
  );
}

export default App;