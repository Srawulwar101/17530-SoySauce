import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/api";
import NavBar from "../elements/Navbar";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await login(username, password);
            setMessage(response.data.message);
            if (response.status === 200) {
                console.log(`Login successful for user: ${username}`);
                localStorage.setItem("token", response.data.token); // Store the token
                localStorage.setItem("username", username); // Store the username
                navigate("/"); // Redirect to the home page
            }
        } catch (error) {
            setMessage("Login failed. Please check your credentials.");
        }
    };

    return (
        <>
            <NavBar />
            <Container className="login-container">
                <h1>Welcome to HaaS PoC App!</h1>
                <p>Please log in to access our services below.</p>
                <Form className="login-form" onSubmit={handleLoginSubmit}>
                    <h2>Login</h2>
                    <Form.Group className="mb-3" controlId="formBasicUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>
                    <p>
                        Don't have an account?{" "}
                        <a href="/signup" style={{ color: "blue" }}>
                            Sign Up
                        </a>
                    </p>
                    <Button variant="primary" type="submit">
                        Login
                    </Button>
                    {message && (
                        <Form.Text className="text-danger login-message">
                            {message}
                        </Form.Text>
                    )}
                </Form>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <Button variant="contained" color="secondary" href="/">Back to Home</Button>
                    <Button variant="contained" color="secondary" href="/login">Back to Login</Button>
                </div>
            </Container>
        </>
    );
};

export default Login;