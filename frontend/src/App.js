import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Project from './components/Project';
import Resource from './components/Resource';

function App() {
    // Placeholder for userId - In a real app, this would come from user authentication
    const userId = 'your_user_id';  

    return (
        <Router>
            <div className="App">
                <h1>HaaS PoC App</h1>
                <Routes>
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/projects" element={<Project userId={userId} />} />
                    <Route path="/resources" element={<Resource />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
