import React from 'react'

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function Admin() {
    return (
        <div style={{position:'relative',left:'40%', top:'10vh'}}>
            <Login />
        </div>
    );
};

function Login() {
    return (
        
        <Card style={{ width: '18rem' }}>
        <Card.Body>
        <Card.Text>
            <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Usuario</Form.Label>
                    <Form.Control type="text" placeholder="Usuario" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control type="password" placeholder="Contraseña" />
                </Form.Group>
                <Button variant="primary" type="submit"> Iniciar sesión </Button>
            </Form>
        </Card.Text>
        </Card.Body>
    </Card>
    
    );
}

export default Admin;