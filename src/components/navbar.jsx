import React, { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { Link } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import logo from '../logo_unlam.svg'


const MyNavbar = () => {
    const { user, isAuthenticated } = useContext(AuthContext);
    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <img src={logo} alt='Logotipo UNLAM' style={{width:50, marginTop: 0, marginRight:20, marginLeft:-100}} />
                <Navbar.Brand href="/">Laboratorio de electronica</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/">Inicio</Nav.Link>
                        <Nav.Link href="/inventario">Inventario</Nav.Link>
                        <NavDropdown title="Reservas" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/inventario">Proyector</NavDropdown.Item>
                            <NavDropdown.Item href="/">Instrumentos</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link href="/">{"user.username"}</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default MyNavbar;
