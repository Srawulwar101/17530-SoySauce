import React from 'react';
import ProjectTest from './ProjectTest';
import NavBar from "../elements/Navbar";
import {Button} from '@mui/material'

const Projects = () => {
    const projectList = [
        {name: 'Project 1', hw1: 50, hw2: 0, users: ['Alice', 'Bob'], joined: false},
        {name: 'Project 2', hw1: 50, hw2: 0, users: ['Charlie'], joined: true},
        {name: 'Project 3', hw1: 0, hw2: 0, users: [], joined: false}
    ];

    return (
        <>
        <NavBar />
        <div>
            <h1>Projects</h1>
            {projectList.map((project, index) => (
                <ProjectTest key={index} project={project} />
            ))}
            <Button variant="contained" color="primary">Add New Project</Button>
        </div>
        <Button href="/">Back to Home</Button>
        </>
    );
};

export default Projects;