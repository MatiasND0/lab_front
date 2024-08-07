import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Nav, Table, Modal, Button, Form } from 'react-bootstrap';

const IP = 'localhost'

function Inventario() {
    const [selectedTableKey, setSelectedTableKey] = useState('instrumentos');
    const [data, setData] = useState(null);

    const handleSelectTable = (eventKey) => {
        setSelectedTableKey(eventKey);
    };

    useEffect(() => {
        if (selectedTableKey) {
            fetchData(selectedTableKey);
        }
    }, [selectedTableKey]);

    const fetchData = async (key) => {
        try {
            const response = await fetch(`http://${IP}:3000/inventory`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ table: key }),
            });
            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <Container fluid >
            <Row>
                <Col xs={1}>

                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Agregar {selectedTableKey}</Modal.Title>
                        </Modal.Header>

                        <FormsSelect form={selectedTableKey} />

                    </Modal>
                    <Nav defaultActiveKey="instrumentos" className="flex-column" onSelect={handleSelectTable}>
                        <Nav.Link eventKey="instrumentos">Instrumentos</Nav.Link>
                        <Nav.Link eventKey="proyectores">Proyectores</Nav.Link>
                        <Nav.Link eventKey="notebooks">Notebooks</Nav.Link>
                        <Nav.Link eventKey="libros">Libros</Nav.Link>
                        <Button variant="primary" onClick={handleShow}>Launch demo modal</Button>
                    </Nav>
                </Col>
                <Col>
                    <TableData data={data} />
                </Col>
            </Row>
        </Container>
    )
};

function TableData({ data }) {
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
                            <Button onClick={() => handleDelete(row)} variant='danger'>Eliminar</Button> {/* Celda con el botón */}
                            </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    )

}

const handleDelete = (row) => {
    console.log('Eliminar el elemento con Numero de inventario:', row.nro_inv);



    try {
        const response = fetch('http://localhost:3000/remove-item', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({nro_inv: row.nro_inv}),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = response.json();
        console.log('Success:', result);
    } catch (error) {
        console.error('Error:', error);
    }

}

function FormsSelect({ form }) {
    const [formData, setFormData] = useState({table: form});

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
        console.log(formData)
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        (formData.hdmi === true) ? formData.hdmi=1 : formData.hdmi=0;
        (formData.vga === true) ? formData.vga=1 : formData.vga=0;
        if (formData.estado === false) {
            formData.estado = 'Fun_D'
        }

        console.log(JSON.stringify(formData))
        try {
            const response = await fetch('http://localhost:3000/add-item', {
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
        } catch (error) {
            console.error('Error:', error);
        }
    };
    
    switch (form) {
        case 'instrumentos':
            return (
                <Form style={{ margin: "5%" }} onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="nro_inv">Nro Inv</Form.Label>
                        <Form.Control id="nro_inv" name="nro_inv" type="text" placeholder="Nro Inv" onChange={handleChange}/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="cod_rec">Cod Rec</Form.Label>
                        <Form.Control id="cod_rec" name="cod_rec" type="text" placeholder="Cod Rec" onChange={handleChange}/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="tipo">Tipo</Form.Label>
                        <Form.Control id="tipo" name="tipo" type="text" placeholder="Tipo" onChange={handleChange}/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="descripcion">Descripcion</Form.Label>
                        <Form.Control id="descripcion" name="descripcion" type="text" placeholder="Descripcion" onChange={handleChange}/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="marca">Marca</Form.Label>
                        <Form.Control id="marca" name="marca" type="text" placeholder="Marca" onChange={handleChange}/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="modelo">Modelo</Form.Label>
                        <Form.Control id="modelo" name="modelo" type="text" placeholder="Modelo" onChange={handleChange}/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="sn">SN</Form.Label>
                        <Form.Control id="sn" name="sn" type="text" placeholder="SN" onChange={handleChange}/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="ab_rango">Ab Rango</Form.Label>
                        <Form.Control id="ab_rango" name="ab_rango" type="text" placeholder="Ab Rango" onChange={handleChange}/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="cod_manual">Cod Manual</Form.Label>
                        <Form.Control id="cod_manual" name="cod_manual" type="text" placeholder="Cod Manual" onChange={handleChange}/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="especificaciones">Especificaciones</Form.Label>
                        <Form.Control id="especificaciones" name="especificaciones" type="text" placeholder="Especificaciones"onChange={handleChange} />
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
                        <Form.Label htmlFor="ubicacion">Ubicacion</Form.Label>
                        <Form.Control id="ubicacion" name="ubicacion" type="text" placeholder="Ubicacion" onChange={handleChange}/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="adicionales">Adicionales</Form.Label>
                        <Form.Control id="adicionales" name="adicionales" type="text" placeholder="Adicionales" onChange={handleChange}/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="fecha_ingreso">Fecha Ingreso</Form.Label>
                        <Form.Control id="fecha_ingreso" name="fecha_ingreso" type="date" onChange={handleChange}/>
                    </Form.Group>
                    <Button type="submit" >Submit</Button>
                </Form>
            )
        case 'proyectores':
            return (
                <Form style={{ margin: "5%" }} onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="nro_inv">Nro Inv</Form.Label>
                        <Form.Control id="nro_inv" name="nro_inv" type="text" placeholder="Nro Inv" onChange={handleChange}/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="cod_rec">Cod Rec</Form.Label>
                        <Form.Control id="cod_rec" name="cod_rec" type="text" placeholder="Cod Rec" onChange={handleChange}/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="marca">Marca</Form.Label>
                        <Form.Control id="marca" name="marca" type="text" placeholder="Marca" onChange={handleChange}/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="modelo">Modelo</Form.Label>
                        <Form.Control id="modelo" name="modelo" type="text" placeholder="Modelo" onChange={handleChange}/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="sn">SN</Form.Label>
                        <Form.Control id="sn" name="sn" type="text" placeholder="SN" onChange={handleChange}/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="ubicacion">Ubicacion</Form.Label>
                        <Form.Control id="ubicacion" name="ubicacion" type="text" placeholder="Ubicacion" onChange={handleChange}/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="adicionales">Adicionales</Form.Label>
                        <Form.Control id="adicionales" name="adicionales" type="text" placeholder="Adicionales" onChange={handleChange}/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="fecha_ingreso">Fecha Ingreso</Form.Label>
                        <Form.Control id="fecha_ingreso" name="fecha_ingreso" type="date" onChange={handleChange}/>
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
                    <Form.Group className="mb-3" >
                        <Form.Check
                            type="checkbox"
                            id="hdmi"
                            name="hdmi"
                            label="HDMI"
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Button type="submit" >Submit</Button>
                </Form>
            )
        case 'notebooks':
            return (
                <Form style={{ margin: "5%" }} onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="nro_inv">Nro Inv</Form.Label>
                        <Form.Control id="nro_inv" name="nro_inv" type="text" placeholder="Nro Inv" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="cod_rec">Cod Rec</Form.Label>
                        <Form.Control id="cod_rec" name="cod_rec" type="text" placeholder="Cod Rec" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="marca">Marca</Form.Label>
                        <Form.Control id="marca" name="marca" type="text" placeholder="Marca" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="modelo">Modelo</Form.Label>
                        <Form.Control id="modelo" name="modelo" type="text" placeholder="Modelo" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="sn">SN</Form.Label>
                        <Form.Control id="sn" name="sn" type="text" placeholder="SN" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="estado">Estado</Form.Label>
                        <Form.Select id="estado" name="estado">
                            <option value="Fun_D">Fun_D</option>
                            <option value="Fun_ND">Fun_ND</option>
                            <option value="Rep">Rep</option>
                            <option value="Baja_B">Baja_B</option>
                            <option value="PATRON">PATRON</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="ubicacion">Ubicacion</Form.Label>
                        <Form.Control id="ubicacion" name="ubicacion" type="text" placeholder="Ubicacion" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="fecha_ingreso">Fecha Ingreso</Form.Label>
                        <Form.Control id="fecha_ingreso" name="fecha_ingreso" type="date" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Check
                            type="checkbox"
                            id="vga"
                            name="vga"
                            label="VGA"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Check
                            type="checkbox"
                            id="hdmi"
                            name="hdmi"
                            label="HDMI"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="adicionales">Adicionales</Form.Label>
                        <Form.Control id="adicionales" name="adicionales" type="text" placeholder="Adicionales" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="s_op">S.O.</Form.Label>
                        <Form.Control id="s_op" name="s_op" type="text" placeholder="S.O." />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="lectora_DVD">Lectora DVD</Form.Label>
                        <Form.Control id="lectora_DVD" name="lectora_DVD" type="text" placeholder="Lectora DVD" />
                    </Form.Group>
                    <Button type="submit" >Submit</Button>
                </Form>
            )
        case 'libros':
            return (
                <Form style={{ margin: "5%" }} onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="id">ID</Form.Label>
                        <Form.Control id="id" name="id" type="text" placeholder="ID" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="descripcion">Descripcion</Form.Label>
                        <Form.Control id="descripcion" name="descripcion" type="text" placeholder="Descripcion" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="idioma">Idioma</Form.Label>
                        <Form.Control id="idioma" name="idioma" type="text" placeholder="Idioma" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="tipo">Tipo</Form.Label>
                        <Form.Control id="tipo" name="tipo" type="text" placeholder="Tipo" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="ubicacion">Ubicacion</Form.Label>
                        <Form.Control id="ubicacion" name="ubicacion" type="text" placeholder="Ubicacion" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="instrumento_asociado">Instrumento Asociado</Form.Label>
                        <Form.Control id="instrumento_asociado" name="instrumento_asociado" type="text" placeholder="Instrumento Asociado" />
                    </Form.Group>
                    <Button type="submit" >Submit</Button>
                </Form>
            )
        default:
            break;
    }


}

export default Inventario;
