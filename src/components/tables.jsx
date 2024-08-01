import React, { useEffect, useState } from 'react';

import Table from 'react-bootstrap/Table';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

function MyTable() {
    return (
        <div>
            <MyTab />
        </div>
    );
}


function MyTab() {
    return (
        <Tabs
            defaultActiveKey="profile"
            id="uncontrolled-tab-example"
            className="mb-3"
        >
            <Tab eventKey="instrumentos" title="Instrumentos">
                <TablaInstrumentos />
            </Tab>
            <Tab eventKey="proyectores" title="Proyectores">
                <TablaProyectores />
            </Tab>
            <Tab eventKey="notebooks" title="Notebooks">
                <TablaNotebooks />
            </Tab>
            <Tab eventKey="libros" title="Libros">
                <TablaLibros/>
            </Tab>
        </Tabs>
    );
}

function TablaInstrumentos() {

    const [data, setData] = useState(null);
    useEffect(() => {
        fetch('http://localhost:3000/api/instrumentos')
            .then(response => response.json())
            .then(data => setData(data))
            .catch(error => console.error('Error:', error));
    }, []);
    try {
        if (!Array.isArray(data) || data.length === 0) {
            return <p>No hay datos disponibles</p>;
        }
        return (
            <Table striped bordered hover style={{position:'relative', width:'90%',left:'5%', top:'15px'}}>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Cod. Reserva</th>
                        <th>Instrumento</th>
                        <th>Marca</th>
                        <th>Modelo</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td>{item.nro_inv - 99000000}</td>
                            <td>{item.cod_rec}</td>
                            <td>{item.tipo}</td>
                            <td>{item.marca}</td>
                            <td>{item.modelo}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        )
    }
    catch (error) {
        console.error('Error al renderizar la tabla:', error);
        return <p>Ocurrió un error al mostrar los datos.</p>;
    }
}

function TablaProyectores() {

    const [data, setData] = useState(null);
    useEffect(() => {
        fetch('http://localhost:3000/api/proyectores')
            .then(response => response.json())
            .then(data => setData(data))
            .catch(error => console.error('Error:', error));
    }, []);
    try {
        if (!Array.isArray(data) || data.length === 0) {
            return <p>No hay datos disponibles</p>;
        }
        return (
            <Table striped bordered hover style={{position:'relative', width:'90%',left:'5%', top:'15px'}}>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Cod. Reserva</th>
                        <th>Marca</th>
                        <th>Modelo</th>
                        <th>VGA</th>
                        <th>HDMI</th>
                        <th>Adicionales</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td>{item.nro_inv}</td>
                            <td>{item.cod_rec}</td>
                            <td>{item.marca}</td>
                            <td>{item.modelo}</td>
                            <td>{((item.vga === 1) ? 'Si' : 'No')}</td>
                            <td>{((item.hdmi === 1) ? 'Si' : 'No')}</td>
                            <td>{item.adicionales}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        )
    }
    catch (error) {
        console.error('Error al renderizar la tabla:', error);
        return <p>Ocurrió un error al mostrar los datos.</p>;
    }
}

function TablaNotebooks() {

    const [data, setData] = useState(null);
    useEffect(() => {
        fetch('http://localhost:3000/api/notebooks')
            .then(response => response.json())
            .then(data => setData(data))
            .catch(error => console.error('Error:', error));
    }, []);
    try {
        if (!Array.isArray(data) || data.length === 0) {
            return <p>No hay datos disponibles</p>;
        }
        return (
            <Table striped bordered hover style={{position:'relative', width:'90%',left:'5%', top:'15px'}}>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Cod. Reserva</th>
                        <th>Marca</th>
                        <th>Modelo</th>
                        <th>VGA</th>
                        <th>HDMI</th>
                        <th>OS</th>
                        <th>DVD</th>
                        <th>Adicionales</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td>{item.nro_inv}</td>
                            <td>{item.cod_rec}</td>
                            <td>{item.marca}</td>
                            <td>{item.modelo}</td>
                            <td>{((item.vga === 1) ? 'Si' : 'No')}</td>
                            <td>{((item.hdmi === 1) ? 'Si' : 'No')}</td>
                            <td>{item.s_op}</td>
                            <td>{item.lectora_DVD}</td>
                            <td>{item.adicionales}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        )
    }
    catch (error) {
        console.error('Error al renderizar la tabla:', error);
        return <p>Ocurrió un error al mostrar los datos.</p>;
    }
}

function TablaLibros() {

    const [data, setData] = useState(null);
    useEffect(() => {
        fetch('http://localhost:3000/api/libros')
            .then(response => response.json())
            .then(data => setData(data))
            .catch(error => console.error('Error:', error));
    }, []);
    try {
        if (!Array.isArray(data) || data.length === 0) {
            return <p>No hay datos disponibles</p>;
        }
        return (
            <Table striped bordered hover style={{position:'relative', width:'90%',left:'5%', top:'15px'}}>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Descripcion</th>
                        <th>Idioma</th>
                        <th>Tipo</th>
                        <th>Instr. asociado</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td>{item.id}</td>
                            <td>{item.descripcion}</td>
                            <td>{item.idioma}</td>
                            <td>{item.tipo}</td>
                            <td>{((item.instrumento_asociado === 'sin instrumento asociado') ? '-' : item.instrumento_asociado)}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        )
    }
    catch (error) {
        console.error('Error al renderizar la tabla:', error);
        return <p>Ocurrió un error al mostrar los datos.</p>;
    }
}

export default MyTable;