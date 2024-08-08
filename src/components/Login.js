import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const IP = 'localhost'

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

function Login ()
{
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const data = {
                username: username,
                password: password
            }
            await fetch(`http://${IP}:3000/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(result => {
                if(result.token)
                {
                    localStorage.setItem('token',result.token)
                }
                console.log(parseJwt(result.token))
            })
        }
        catch{}
    };

    return(
        <Card style={{ width: '18rem' }}>
        <Card.Body>
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
}

export default Login;