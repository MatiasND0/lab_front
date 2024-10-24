import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { parseJwt } from "./utils/jwtParser";
import { Container, Button, Table, Modal, Form } from 'react-bootstrap';

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
        body: JSON.stringify({ username: parsedToken.username, role: parsedToken.role }),
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

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
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
          <h1>Bienvenido {parsedToken.username} | {getUserRole(parsedToken.role)} | {(parsedToken.phoneNumber)} </h1>
          <div>
            <h2>Reservas</h2>
            <TablaReservas data={data} onDelete={handleDelete} userrole={parsedToken.role} /> {/* Pasar la función de eliminación como prop */}

            {parsedToken.role === 1 && ( // Solo muestra si el usuario tiene permisos
              <>
                <Button variant="primary" onClick={handleShow}>
                  Registrar usuario
                </Button>
                <Modal show={show} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>Agregar</Modal.Title>
                  </Modal.Header>
                  <RegisterForm onClose={handleClose} /> {/* Pasar handleClose al RegisterForm */}
                </Modal>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function TablaReservas({ data, onDelete, userrole }) { // Recibir la función de eliminación como prop
  return (
    <table className="table-auto w-full">
      <thead>
        <tr>
          <th className="px-4 py-2">ID</th>
          <th className="px-4 py-2">Proyector</th>
          <th className="px-4 py-2">Fecha</th>
          <th className="px-4 py-2">Turno</th>
          <th className="px-4 py-2">Materia</th>
          {userrole && ( // Solo muestra si el usuario tiene permisos
            <>
              <th className="px-4 py-2">Usuario</th>
              <th className="px-4 py-2">Numero de telefono</th>
            </>
          )}
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
              {userrole && ( // Solo muestra si el usuario tiene permisos

                <>
                  <td className="border px-4 py-2">{reserva.username}</td>
                  <td className="border px-4 py-2">{reserva.phoneNumber}</td>
                </>
              )}
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

function RegisterForm({ onClose }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    phoneNumber: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene la recarga de la página

    // Agregar el rol directamente en el cuerpo de la solicitud
    const payload = {
      ...formData,
      role: 2, // Rol siempre es 2 (docente)
    };

    try {
      const response = await fetch(`http://${IP}:3000/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Registro exitoso:', data);
        onClose(); // Cierra el formulario una vez registrado
      } else {
        const errorData = await response.json();
        console.error('Error en el registro:', errorData.message);
      }
    } catch (error) {
      console.error('Error al conectar con el backend:', error);
    }
  };

  return (
    <Form style={{ margin: "5%" }} onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label htmlFor="username">Usuario</Form.Label>
        <Form.Control
          id="username"
          name="username"
          type="text"
          placeholder="Usuario"
          value={formData.username}
          onChange={handleChange}
          required // Campo obligatorio
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label htmlFor="password">Contraseña</Form.Label>
        <Form.Control
          id="password"
          name="password"
          type="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          required // Campo obligatorio
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label htmlFor="phoneNumber">Número de Teléfono</Form.Label>
        <Form.Control
          id="phoneNumber"
          name="phoneNumber"
          type="text"
          placeholder="Número de Teléfono"
          value={formData.phoneNumber}
          onChange={handleChange}
          required // Campo obligatorio
        />
      </Form.Group>
      <Button type="submit">Registrar</Button>
    </Form>
  );
}

export default Inicio;
