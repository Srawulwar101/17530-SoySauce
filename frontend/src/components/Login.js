import React, { useState } from "react";
import { login } from "../services/api";
import NavBar from "./Navbar";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

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
      <Form>
        <h2>Login</h2>
        <Form.Group
          className="mb-3"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        >
          <Form.Label>Username</Form.Label>
          <Form.Control type="email" placeholder="Enter username" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit" onSubmit={handleLogin}>
          Login
        </Button>
        <Form.Text>{message}</Form.Text>
      </Form>
      {/* 
      <div>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
        <p>{message}</p>
      </div> */}
    </>
  );
};

export default Login;
