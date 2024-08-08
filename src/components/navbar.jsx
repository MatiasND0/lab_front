import React from 'react';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import logo from '../logo_unlam.svg'

function parseJwt(token) {
    if (!token) {
        return null;
    }
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}
const token = localStorage.getItem('token');
const parsedToken = token ? parseJwt(token) : null;

const MyNavbar = () => {
    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <img src={logo} alt='Logotipo UNLAM' style={{width:50, marginRight:'2%'}} />
                <Navbar.Brand href="/">Laboratorio de electronica</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/">Inicio</Nav.Link>
                        <NavDropdown title="Inventario" id="basic-nav-dropdown">
                            {/* <Nav.Link href="/instrumentos">Instrumentos</Nav.Link> */}
                            <Nav.Link href="/proyectores">Proyectores</Nav.Link>
                            {/* <Nav.Link href="/notebooks">Notebooks</Nav.Link> */}
                            <Nav.Link href="/libros">Libros</Nav.Link>
                        </NavDropdown>
                        <NavDropdown title="Reservas" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/inventario">Proyector</NavDropdown.Item>
                            <NavDropdown.Item href="/">Instrumentos</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link href="/inventario">{parsedToken ? (
                <p>{parsedToken.username}</p>
            ) : (
                <p>No token available</p>
            )}</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default MyNavbar;
