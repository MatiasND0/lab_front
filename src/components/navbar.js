import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import logo from '../logo_unlam.svg';


const MyNavbar = () => {
    const token = localStorage.getItem('token');
    const parsedToken = token ? parseJwt(token) : null;

    const isProfesor = parsedToken && (parsedToken.role === 2 || parsedToken.role === 1); // Asegúrate de que el rol de profesor sea el correcto

    const logout = () => {
        localStorage.removeItem('token'); // o cookies.remove('token')
        // Redirigir al usuario a la página de inicio o login
        window.location.href = '/login'; // O usa un hook de React Router si lo estás utilizando
    };

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
                            <Nav.Link href="/proyectores">Proyectores</Nav.Link>
                            <Nav.Link href="/libros">Libros</Nav.Link>
                        </NavDropdown>
                        {isProfesor && (
                            <NavDropdown title="Reservas" id="basic-nav-dropdown">
                                <NavDropdown.Item href="/reserva-proyector">Proyector</NavDropdown.Item>
                                <NavDropdown.Item href="/">Instrumentos</NavDropdown.Item>
                            </NavDropdown>
                        )}
                        {parsedToken && (
                        <Nav.Link onClick={logout}>Cerrar sesión</Nav.Link>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

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


export default MyNavbar;
