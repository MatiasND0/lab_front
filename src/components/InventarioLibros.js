import React, { useState, useEffect } from 'react';
import { Container, Button, Table, Modal, Form } from 'react-bootstrap';

const IP = 'localhost';

function InventarioLibros() {
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
                body: JSON.stringify({ table: 'libros' }),
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
        console.log('Eliminar el elemento con Numero de inventario:', row.id);

        try {
            const response = await fetch(`http://${IP}:3000/remove-item`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ table: 'libros', nro_inv: row.id }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log('Success:', result);

            // Actualizar el estado eliminando el elemento de la tabla
            setData(data.filter(item => item.id !== row.id));
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleAdd = (newItem) => {
        setData([...data, newItem]);
    };

    return (
        <Container fluid style={{ margin: "5px" }}>
            <Button variant="primary" onClick={handleShow} style={{ margin: "5px" }}>
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
                <tr style={{ textTransform: 'capitalize' }}>
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
    const [formData, setFormData] = useState({ table: 'libros', idioma: 'en'});
    const [tipo, setTipo] = useState('libro');

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
        console.log(formData);
    };

    const handleChangeTipo = async (e) => {
        setTipo(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

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
                <Form.Label htmlFor="titulo">Titulo</Form.Label>
                <Form.Control id="titulo" name="titulo" type="text" placeholder="Titulo" onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label htmlFor="descripcion">Descripcion</Form.Label>
                <Form.Control id="descripcion" name="descripcion" type="text" placeholder="Descripcion" onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label htmlFor="idioma">Idioma</Form.Label>
                <Form.Select id="idioma" name="idioma" onChange={handleChange}>
                    <option value="en">Ingles</option>
                    <option value="es">Español</option>
                    <option value="otro">Otro</option>
                </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label htmlFor="tipo">Tipo</Form.Label>
                <Form.Control id="tipo" name="tipo" type="text" placeholder="Tipo" onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label htmlFor="ubicacion">Ubicacion</Form.Label>
                <Form.Control id="ubicacion" name="ubicacion" type="text" placeholder="Ubicacion" onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label htmlFor="cantidad">Cantidad</Form.Label>
                <Form.Control id="cantidad" name="cantidad" type="number" placeholder="Cantidad" onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label htmlFor="tipo">Tipo</Form.Label>
                <Form.Select id="tipo" name="tipo" onChange={handleChangeTipo} >
                    <option value="libro">Libro</option>
                    <option value="manual">Manual</option>
                    <option value="databook">Databook</option>
                    <option value="otro">Otro</option>
                </Form.Select>
            </Form.Group>

            {tipo === 'libro' && (
                <>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="autor">Autor</Form.Label>
                        <Form.Control id="autor" name="autor" type="text" placeholder="Autor" onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="editorial">Editorial</Form.Label>
                        <Form.Control id="editorial" name="editorial" type="text" placeholder="Editorial" onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="year">Año</Form.Label>
                        <Form.Control id="year" name="Año" type="number" min="1900" max="3000" placeholder="Año" onChange={handleChange} />
                    </Form.Group>
                </>
            )}

            {tipo === 'manual' && (
                <>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="equipo">Equipo</Form.Label>
                        <Form.Select id="equipo" name="equipo" onChange={handleChange} >
                            <option value="C">Contador</option>
                            <option value="F">Fuente</option>
                            <option value="G">Generador de funciones</option>
                            <option value="K">Kit</option>
                            <option value="O">Osciloscopio</option>
                            <option value="M">Multimetro</option>
                            <option value="V">Varios</option>
                            <option value="XX">Otros</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="intrumento_asociado">Instrumento asociado</Form.Label>
                        <Form.Control id="intrumento_asociado" name="intrumento_asociado" type="text" placeholder="Instrumento asociado" onChange={handleChange} />
                    </Form.Group>
                </>
            )}

            <Button type="submit" >Submit</Button>
        </Form>
    );
}

export default InventarioLibros;
