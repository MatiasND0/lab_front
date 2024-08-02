import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { AuthContext } from './AuthContext';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [responseData, setResponseData] = useState(null);
    
    const authContext = useContext(AuthContext);
    const login = authContext?.login;
    const navigate = useNavigate();
    
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                login(data.user);
                console.log('Inicio de sesión exitoso:', data);
                setError('');
                setResponseData(data);
                
                navigate('/');
            } else {
                setError('Usuario o contraseña incorrectos');
                console.error('Error en el inicio de sesión:', data.message);
            }
        } catch (error) {
            setError('Error en el inicio de sesión');
            console.error('Error:', error);
        }
    };

    return (
        <Card style={{ width: '18rem' }}>
        <Card.Body>
        <Card.Text>{error}</Card.Text>
        <Card.Text>
            <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Usuario</Form.Label>
                    <Form.Control type="text" value={username} placeholder="Usuario" onChange={(e) => setUsername(e.target.value)} required/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"  required/>
                </Form.Group>
                <Button variant="primary" type="submit"> Iniciar sesión </Button>
            </Form>
        </Card.Text>
        </Card.Body>
        </Card>
    );
};

export default Login;
