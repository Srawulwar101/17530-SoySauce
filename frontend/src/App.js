import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Signup from "./components/pages/Signup";
import Login from "./components/pages/Login";
import Project from "./components/pages/Project";
import Resource from "./components/pages/Resource";
import Home from "./components/pages/Home";
import ProjectsTest from "./components/pages/ProjectsTest";

function App() {
    const isAuthenticated = !!localStorage.getItem("token");

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
                    <Route path="/projects" element={isAuthenticated ? <Project /> : <Navigate to="/login" />} />
                    <Route path="/resources" element={isAuthenticated ? <Resource /> : <Navigate to="/login" />} />
                    <Route path="/test" element={isAuthenticated ? <ProjectsTest /> : <Navigate to="/login" />} />
                    <Route path="*" element={<Navigate to="/login" />} /> {/* Default route */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;