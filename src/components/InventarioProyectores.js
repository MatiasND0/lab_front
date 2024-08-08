import React, { useState, useEffect } from 'react';
import { Container, Button, Table, Modal, Form } from 'react-bootstrap';

const IP = 'localhost';

function InventarioProyectores() {
    const [show, setShow] = useState(false);
    const [data, setData] = useState([]);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

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
    }, []); // El array vacío [] asegura que el efecto se ejecute solo una vez al montar el componente

    const handleDelete = async (row) => {
        console.log('Eliminar el elemento con Numero de inventario:', row.nro_inv);

        try {
            const response = await fetch(`http://${IP}:3000/remove-item`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ table: 'proyectores', nro_inv: row.nro_inv }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log('Success:', result);

            // Actualizar el estado eliminando el elemento de la tabla
            setData(data.filter(item => item.nro_inv !== row.nro_inv));
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleAdd = (newItem) => {
        setData([...data, newItem]);
    };

    return (
        <Container fluid>
            <Button variant="primary" onClick={handleShow}>
                Agregar elemento
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Agregar</Modal.Title>
                </Modal.Header>
                <FormProy onAdd={handleAdd} onClose={handleClose} />
            </Modal>
            <TableData data={data} onDelete={handleDelete} />
        </Container>
    );
};

function TableData({ data, onDelete }) {
    if (!data) {
        return <div>Loading...</div>;
    }

    const excludedColumns = ["column_to_exclude1", "column_to_exclude2"];
    const headers = data.length > 0 ? Object.keys(data[0]).filter(header => !excludedColumns.includes(header)) : [];

    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    {headers.map((header) => (
                        <th key={header}>{header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {headers.map((header) => (
                            <td key={header}>{row[header]}</td>
                        ))}
                        <td>
                            <Button onClick={() => onDelete(row)} variant='danger'>Eliminar</Button> {/* Celda con el botón */}
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}

function FormProy({ onAdd, onClose }) {
    const [formData, setFormData] = useState({table: 'proyectores',estado: 'Fun_D'});

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
