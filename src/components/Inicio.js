import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { parseJwt } from "./utils/jwtParser";


const IP = 'localhost';

function Inicio() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate(); // Inicializa el hook useNavigate

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    } else {
      navigate('/login'); // Redirige a /login si no está autenticado
    }
  }, [navigate]); // Asegúrate de incluir navigate en las dependencias

  const token = localStorage.getItem('token');
  const parsedToken = token ? parseJwt(token) : null;

  const getUserRole = (role) => {
    switch (role) {
      case 1:
        return 'Administrador';
      case 2:
        return 'Docente';
      case 3:
        return 'Alumno';
      default:
        return 'Usuario desconocido';
    }
  };

  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch(`http://${IP}:3000/booked-proy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: parsedToken.username }),
      });
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error al realizar la solicitud POST:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [parsedToken]); // Añadir parsedToken como dependencia para que se ejecute cuando cambie

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://${IP}:3000/delete-booking/${id}`, { // Asegúrate de que esta ruta exista en tu API
        method: 'DELETE',
      });

      if (response.ok) {
        // Elimina la reserva del estado local
        setData((prevData) => prevData.filter((reserva) => reserva.id !== id));
      } else {
        console.error('Error al eliminar la reserva');
      }
    } catch (error) {
      console.error('Error en la solicitud de eliminación:', error);
    }
  };

  return (
    <div>
      {isAuthenticated && (
        <div>
          <h1>Bienvenido {parsedToken.username} | {getUserRole(parsedToken.role)}</h1>
          <div>
            <h2>Reservas</h2>
            <TablaReservas data={data} onDelete={handleDelete} /> {/* Pasar la función de eliminación como prop */}
          </div>
        </div>
      )}
    </div>
  );
}

function TablaReservas({ data, onDelete }) { // Recibir la función de eliminación como prop
  return (
    <table className="table-auto w-full">
      <thead>
        <tr>
          <th className="px-4 py-2">ID</th>
          <th className="px-4 py-2">Proyector</th>
          <th className="px-4 py-2">Fecha</th>
          <th className="px-4 py-2">Turno</th>
          <th className="px-4 py-2">Materia</th>
          <th className="px-4 py-2">Acciones</th> {/* Nueva columna para acciones */}
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((reserva) => (
            <tr key={reserva.id}>
              <td className="border px-4 py-2">{reserva.id}</td>
              <td className="border px-4 py-2">{reserva.cod_rec}</td>
              <td className="border px-4 py-2">{new Date(reserva.fecha).toLocaleDateString()}</td>
              <td className="border px-4 py-2">{reserva.turno}</td>
              <td className="border px-4 py-2">{reserva.materia}</td>
              <td className="border px-4 py-2">
                <button 
                  className="text-red-600 hover:text-red-800"
                  onClick={() => onDelete(reserva.id)} // Llamar a la función de eliminación
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5" className="border px-4 py-2 text-center">No hay reservas disponibles</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default Inicio;
