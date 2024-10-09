import React, { useState } from "react";
import { signup } from "../services/api";
import NavBar from "./Navbar";

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
      <div>
        <h2>Sign Up</h2>
        <form onSubmit={handleSignup}>
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
          <button type="submit">Sign Up</button>
        </form>
        <p>{message}</p>
      </div>
    </>
  );
};

export default Signup;
