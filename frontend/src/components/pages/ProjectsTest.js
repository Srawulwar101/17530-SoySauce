import React, { useEffect, useState } from 'react';
import { getProjects, createProject, addViewer, removeViewer, checkoutResource, checkinResource, joinProject, leaveProject } from '../../services/api'; // Import necessary functions
import NavBar from "../elements/Navbar";
import ProjectTest from './ProjectTest';
import { Button, Form, Container } from 'react-bootstrap';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [message, setMessage] = useState("");
    const [userId] = useState(localStorage.getItem("userId") || ""); // Retrieve userId from local storage
    const [projectName, setProjectName] = useState("");
    const [description, setDescription] = useState("");
    const [projectId, setProjectId] = useState("");

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await getProjects(userId);
                setProjects(response.data.projects);
                if (response.data.projects.length > 0) {
                    setProjectId(response.data.projects[0]._id); // Set the projectId to the first project or handle selection
                }
            } catch (error) {
                setMessage("Failed to fetch projects.");
            }
        };

        fetchProjects();
    }, [userId]);

    const handleCreateProject = async (e) => {
        e.preventDefault();
        console.log("Creating project with userId:", userId); // Log the userId
        try {
            const response = await createProject(userId, projectName, description, projectId);
            console.log("Project creation response:", response.data); // Log the response
            setMessage(response.data.message);
            // Refresh the project list after creating a new project
            const updatedProjects = await getProjects(userId);
            setProjects(updatedProjects.data.projects);
            // Clear the form fields
            setProjectName("");
            setDescription("");
            setProjectId("");
        } catch (error) {
            console.error("Error creating project:", error); // Log the error
            setMessage("Failed to create project.");
        }
    };

    const handleAddViewer = async (projectId, viewerId) => {
        console.log("Attempting to add viewer:", { projectId, viewerId }); // Log the attempt
        try {
            await addViewer(projectId, viewerId);
            setMessage("Viewer added successfully.");
            console.log("Viewer added successfully:", viewerId); // Log success
        } catch (error) {
            console.error("Failed to add viewer:", error); // Log the error
            setMessage("Failed to add viewer.");
        }
    };

    const handleRemoveViewer = async (projectId, viewerId) => {
        try {
            await removeViewer(projectId, viewerId);
            setMessage("Viewer removed successfully.");
        } catch (error) {
            setMessage("Failed to remove viewer.");
        }
    };

    const handleCheckoutResource = async (projectId, resourceSet, units) => {
        const resourceId = resourceSet === "HW Set1" ? "672b88e1053d6a26a995a710" : "672b88e5053d6a26a995a711"; // Replace with actual resource IDs
        const projectIdString = projectId ? projectId.$oid || projectId : ""; // Extract project ID as a string
        console.log("Checking out resource:", { resource_id: resourceId, units, project_id: projectIdString }); // Log the payload
        try {
            const response = await checkoutResource(resourceId, units, projectIdString); // Pass the project ID as a string
            setMessage(response.data.message);
    
            // Update the state of the specific project
            setProjects(prevProjects => prevProjects.map(project => 
                project._id === projectId ? { 
                    ...project, 
                    [resourceSet === "HW Set1" ? "hw1" : "hw2"]: Math.max(0, project[resourceSet === "HW Set1" ? "hw1" : "hw2"] - parseInt(units))
                } : project
            ));
        } catch (error) {
            console.error("Checkout error:", error); // Log the error for debugging
            setMessage("Failed to check out resource.");
        }
    };
    
    const handleCheckinResource = async (projectId, resourceSet, units) => {
        const resourceId = resourceSet === "HW Set1" ? "672b88e1053d6a26a995a710" : "672b88e5053d6a26a995a711"; // Replace with actual resource IDs
        const projectIdString = projectId ? projectId.$oid || projectId : ""; // Extract project ID as a string
        console.log("Checking in resource:", { resource_id: resourceId, units, project_id: projectIdString }); // Log the payload
        try {
            const response = await checkinResource(resourceId, units, projectIdString); // Pass the project ID as a string
            setMessage(response.data.message);
    
            // Update the state of the specific project
            setProjects(prevProjects => prevProjects.map(project => 
                project._id === projectId ? { 
                    ...project, 
                    [resourceSet === "HW Set1" ? "hw1" : "hw2"]: project[resourceSet === "HW Set1" ? "hw1" : "hw2"] + parseInt(units)
                } : project
            ));
        } catch (error) {
            console.error("Checkin error:", error); // Log the error for debugging
            setMessage("Failed to check in resource.");
        }
    };

    const handleJoinProject = async (projectId) => {
        const userId = localStorage.getItem("userId");
        try {
            await joinProject(projectId, userId);
            setMessage("Successfully joined the project.");
            
            // Update the state of the specific project
            setProjects(prevProjects => prevProjects.map(project => 
                project._id === projectId ? { ...project, joined: true } : project
            ));
        } catch (error) {
            console.error("Failed to join project:", error);
            setMessage("Failed to join project.");
        }
    };

    const handleLeaveProject = async (projectId) => {
        const userId = localStorage.getItem("userId");
        try {
            await leaveProject(projectId, userId);
            setMessage("Successfully left the project.");
            
            // Update the state of the specific project
            setProjects(prevProjects => prevProjects.map(project => 
                project._id === projectId ? { ...project, joined: false } : project
            ));
        } catch (error) {
            console.error("Failed to leave project:", error);
            setMessage("Failed to leave project.");
        }
    };

    return (
        <>
            <NavBar />
            <Container>
                <h1>Projects</h1>
                {message && <p>{message}</p>}
                <Form onSubmit={handleCreateProject}>
                    <h2>Create New Project</h2>
                    <Form.Group controlId="formProjectName">
                        <Form.Label>Project Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Project Name"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="formDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="formProjectId">
                        <Form.Label>Project ID</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Project ID"
                            value={projectId}
                            onChange={(e) => setProjectId(e.target.value)}
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Create Project
                    </Button>
                </Form>

                <div>
                    {projects.length === 0 ? (
                        <p>No projects found.</p>
                    ) : (
                        projects.map((project) => (
                            <div key={project._id}>
                                <ProjectTest 
                                    project={project} 
                                    onRemoveViewer={handleRemoveViewer} 
                                    onAddViewer={handleAddViewer} 
                                    onCheckoutResource={(resourceSet, units) => handleCheckoutResource(project._id, resourceSet, units)} 
                                    onCheckinResource={(resourceSet, units) => handleCheckinResource(project._id, resourceSet, units)} 
                                    joined={project.joined} // Pass the joined state
                                />
                                <Button onClick={() => handleJoinProject(project._id)}>Join Project</Button>
                                <Button onClick={() => handleLeaveProject(project._id)}>Leave Project</Button>
                            </div>
                        ))
                    )}
                </div>
            </Container>
        </>
    );
};

export default Projects;