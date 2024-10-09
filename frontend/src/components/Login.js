import React, { useState } from "react";
import { login } from "../services/api";
import NavBar from "./Navbar";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login(username, password);
      setMessage(response.data.message);
      // Store user session or token here if needed
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
        <Form className="login-form" onSubmit={handleLogin}>
          <h2>Login</h2>
          <Form.Group
            className="mb-3"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          >
            <Form.Label>Username</Form.Label>
            <Form.Control placeholder="Enter Username" />
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
      </Container>
    </>
  );
};

export default Login;
