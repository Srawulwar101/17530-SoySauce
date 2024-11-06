import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';

const Project = () => {
    const username = localStorage.getItem("username");
    const [projectName, setProjectName] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');
    const [projects, setProjects] = useState([]);

    const handleCreateProject = async (e) => {
        e.preventDefault();

        const newProject = {
            user_id: username,
            project_name: projectName,
            description: description,
            project_id: `project_${projects.length + 1}`
        };

        console.log("Sending request with data:", newProject);

        try {
            const response = await fetch('http://localhost:5000/api/projects/createProject', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newProject),
            });

            if (response.ok) {
                const result = await response.json();
                setMessage(`Project created with ID: ${result.project_id}`);
                setProjects([...projects, newProject]);
            } else {
                setMessage('Failed to create project');
            }
        } catch (error) {
            console.error('Error creating project:', error);
            setMessage('Error creating project');
        }
    };

    const loadProjects = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/projects');
            const data = await response.json();
            setProjects(data);
        } catch (error) {
            console.error('Error loading projects:', error);
        }
    };

    return (
        <>
            <div>
                <h2>Create a New Project</h2>
                <form onSubmit={handleCreateProject}>
                    <TextField
                        label="Project Name"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                    />
                    <TextField
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <button type="submit">Create Project</button>
                </form>
                <p>{message}</p>

                <h3>Your Projects</h3>
                <button onClick={loadProjects}>Load Projects</button>
                <ul>
                    {projects.map((project) => (
                        <li key={project.project_id}>
                            <strong>{project.project_name}</strong>: {project.description}
                        </li>
                    ))}
                </ul>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <Button variant="contained" color="secondary" href="/">Back to Home</Button>
                <Button variant="contained" color="secondary" href="/login">Back to Login</Button>
            </div>
        </>
    );
};

export default Project;
