import React, { useState, useEffect } from 'react';
import { Container, Button, Table, Modal, Form } from 'react-bootstrap';
import { parseJwt } from "./utils/jwtParser";

const IP = 'localhost';

function InventarioProyectores() {
    const [show, setShow] = useState(false);
    const [data, setData] = useState([]);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const token = localStorage.getItem('token');
    const parsedToken = token ? parseJwt(token) : null;

    // Verificamos si el usuario tiene un rol que le permite ver las acciones (por ejemplo, rol 1)
    const isAdministrator = parsedToken && (parsedToken.role === 1);

    const fetchData = async () => {
        try {
            const response = await fetch(`http://${IP}:3000/inventory`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ table: 'proyectores' }),
            });
            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error('Error al realizar la solicitud POST:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (nro_inv) => {
        console.log('Eliminar el elemento con Numero de inventario:', nro_inv);

        try {
            const response = await fetch(`http://${IP}:3000/remove-item`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ table: 'proyectores', nro_inv: nro_inv }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log('Success:', result);

            // Actualizar el estado eliminando el elemento de la tabla
            setData(data.filter(item => item.nro_inv !== nro_inv));
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleAdd = (newItem) => {
        setData([...data, newItem]);
    };

    return (
        <Container fluid>
            {isAdministrator && ( // Usar userrole para mostrar la celda de acciones
                <Button variant="primary" onClick={handleShow}>
                    Agregar elemento
                </Button>
            )}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Agregar</Modal.Title>
                </Modal.Header>
                <FormProy onAdd={handleAdd} onClose={handleClose} />
            </Modal>
            <TableData data={data} onDelete={handleDelete} userrole={isAdministrator} />
        </Container>
    );
};

function TableData({ data, onDelete, userrole }) {
    return (
        <table className="table-auto w-full">
            <thead>
                <tr>
                    <th className="px-4 py-2">ID</th>
                    <th className="px-4 py-2">Código de reserva</th>
                    <th className="px-4 py-2">Marca</th>
                    <th className="px-4 py-2">Modelo</th>
                    <th className="px-4 py-2">Serial Number</th>
                    {userrole && ( // Usar userrole para mostrar la celda de acciones
                        <th className="px-4 py-2">Acciones</th>
                    )}
                </tr>
            </thead>
            <tbody>
                {data.length > 0 ? (
                    data.map((reserva) => (
                        <tr key={reserva.id}>
                            <td className="border px-4 py-2">{reserva.nro_inv}</td>
                            <td className="border px-4 py-2">{reserva.cod_rec}</td>
                            <td className="border px-4 py-2">{reserva.marca}</td>
                            <td className="border px-4 py-2">{reserva.modelo}</td>
                            <td className="border px-4 py-2">{reserva.sn}</td>
                            {userrole && ( // Solo muestra el botón de eliminar si el usuario tiene permisos
                                <td className="border px-4 py-2">
                                    <button
                                        className="text-red-600 hover:text-red-800"
                                        onClick={() => onDelete(reserva.nro_inv)}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={userrole ? 6 : 5} className="border px-4 py-2 text-center">
                            No hay reservas disponibles
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}

function FormProy({ onAdd, onClose }) {
    const [formData, setFormData] = useState({ table: 'proyectores', estado: 'Fun_D' });

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
        console.log(formData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        formData.hdmi = formData.hdmi ? 1 : 0;
        formData.vga = formData.vga ? 1 : 0;

        console.log(JSON.stringify(formData));
        try {
            const response = await fetch(`http://${IP}:3000/add-item`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log('Success:', result);

            // Agregar el nuevo elemento al estado
            onAdd(formData);

            // Cerrar el modal
            onClose();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <Form style={{ margin: "5%" }} onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
                <Form.Label htmlFor="nro_inv">Nro Inv</Form.Label>
                <Form.Control id="nro_inv" name="nro_inv" type="text" placeholder="Nro Inv" onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label htmlFor="cod_rec">Cod Rec</Form.Label>
                <Form.Control id="cod_rec" name="cod_rec" type="text" placeholder="Cod Rec" onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label htmlFor="marca">Marca</Form.Label>
                <Form.Control id="marca" name="marca" type="text" placeholder="Marca" onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label htmlFor="modelo">Modelo</Form.Label>
                <Form.Control id="modelo" name="modelo" type="text" placeholder="Modelo" onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label htmlFor="sn">SN</Form.Label>
                <Form.Control id="sn" name="sn" type="text" placeholder="SN" onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label htmlFor="ubicacion">Ubicacion</Form.Label>
                <Form.Control id="ubicacion" name="ubicacion" type="text" placeholder="Ubicacion" onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label htmlFor="adicionales">Adicionales</Form.Label>
                <Form.Control id="adicionales" name="adicionales" type="text" placeholder="Adicionales" onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label htmlFor="fecha_ingreso">Fecha Ingreso</Form.Label>
                <Form.Control id="fecha_ingreso" name="fecha_ingreso" type="date" onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label htmlFor="estado">Estado</Form.Label>
                <Form.Select id="estado" name="estado" onChange={handleChange}>
                    <option value="Fun_D">Fun_D</option>
                    <option value="Fun_ND">Fun_ND</option>
                    <option value="Rep">Rep</option>
                    <option value="Baja_B">Baja_B</option>
                    <option value="PATRON">PATRON</option>
                </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Check
                    type="checkbox"
                    id="vga"
                    name="vga"
                    label="VGA"
                    onChange={handleChange}
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Check
                    type="checkbox"
                    id="hdmi"
                    name="hdmi"
                    label="HDMI"
                    onChange={handleChange}
                />
            </Form.Group>
            <Button type="submit">Submit</Button>
        </Form>
    );
}

export default InventarioProyectores;
