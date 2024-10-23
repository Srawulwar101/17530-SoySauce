import React, { useState } from "react";
import { signup } from "../../services/api";
import NavBar from "../elements/Navbar";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await signup(username, password);
      setMessage(response.data.message);
    } catch (error) {
      setMessage("Signup failed. Please try again.");
    }
  };

  return (
    <>
      <NavBar />
      <Container className="login-container">
        <Form className="login-form" onSubmit={handleSignup}>
          <h2>Sign Up</h2>
          <Form.Group className="mb-3">
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
            Already have an account?{" "}
            <a href="/login" style={{ color: "blue" }}>
              Login
            </a>
          </p>
          <Button variant="primary" type="submit">
            Sign Up
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

export default Signup;
