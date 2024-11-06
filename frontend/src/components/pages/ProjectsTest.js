import React, { useState, useEffect } from 'react';
import ProjectTest from './ProjectTest';
import NavBar from "../elements/Navbar";
import { Button, TextField } from '@mui/material';

const ProjectsTest = () => {
    const username = localStorage.getItem("username");
    const [projectList, setProjectList] = useState([]);
    const [newProjectName, setNewProjectName] = useState('');
    const [newProjectDescription, setNewProjectDescription] = useState('');

    useEffect(() => {
        // Fetch projects from the backend when the component mounts
        const fetchProjects = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/projects/get_projects/' + username);
                const data = await response.json();
                setProjectList(data.projects);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        fetchProjects();
    }, [username]);

    const addNewProject = async () => {
        const newProject = { name: newProjectName, hw1: 0, hw2: 0, users: [username], joined: false, userId: username };
        
        // Make API call to backend to create the project
        try {
            const response = await fetch('http://localhost:5000/api/projects/createProject', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: username,
                    project_name: newProjectName,
                    description: newProjectDescription,
                    project_id: `project_${projectList.length + 1}`
                }),
            });

            if (response.ok) {
                const result = await response.json();
                const createdProject = {
                    name: newProjectName,
                    hw1: 0,
                    hw2: 0,
                    users: [username],
                    joined: false,
                    userId: username,
                    project_id: result.project_id
                };
                setProjectList(prevProjectList => {
                    const updatedProjectList = [...prevProjectList, createdProject];
                    return updatedProjectList;
                });  // Update the state with the new project
            } else {
                console.error('Failed to create project');
            }
        } catch (error) {
            console.error('Error adding new project:', error);
        }
    };

    return (
        <>
            <NavBar />
            <div>
                <h1>Projects</h1>
                <TextField
                    label="Project Name"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                />
                <TextField
                    label="Project Description"
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                />
                <Button variant="contained" color="primary" onClick={addNewProject}>Add New Project</Button>
                {projectList.map((project, index) => (
                    <ProjectTest
                        key={index}
                        project={project}
                        userId={username}
                    />
                ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <Button variant="contained" color="secondary" href="/">Back to Home</Button>
                <Button variant="contained" color="secondary" href="/login">Back to Login</Button>
            </div>
        </>
    );
};

export default ProjectsTest;