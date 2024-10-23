import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from "./components/pages/Signup";
import Login from "./components/pages/Login";
import Project from "./components/pages/Project";
import Resource from "./components/pages/Resource";
import Home from "./components/pages/Home";
import ProjectsTest from "./components/pages/ProjectsTest";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  // Placeholder for userId - In a real app, this would come from user authentication
  const userId = "your_user_id";

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/projects"
            element={<ProtectedRoute element={Project} userId={userId} />}
          />
          <Route
            path="/resources"
            element={<ProtectedRoute element={Resource} />}
          />
          <Route
            path="/test"
            element={<ProtectedRoute element={ProjectsTest} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;