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
    const [joinProjectId, setJoinProjectId] = useState(""); // State for the join project ID


    const fetchProjects = async () => {
        try {
            const response = await getProjects(userId);
            console.log("Fetched projects:", response.data.projects); // Log fetched projects to confirm data


            setProjects(response.data.projects.map(project => ({
                ...project,
                // Check if the current user's ID is in the joined_users array
                joined: project.joined_users && project.joined_users.includes(userId)
            })));
        } catch (error) {
            setMessage("Failed to fetch projects.");
            console.error("Fetch projects error:", error);
        }
    };


    useEffect(() => {
   
        fetchProjects();
    }, [userId]);
   
   


    const handleCreateProject = async (e) => {
        e.preventDefault();
        console.log("Creating project with userId:", userId); // Log the userId
        console.log("Current projectId:", projectId); // Log the current projectId
        try {
            const response = await createProject(userId, projectName, description, projectId);
            console.log("Project creation response:", response.data); // Log the response
            setMessage(response.data.message); // This line sets the message to "Project created successfully"
            // Refresh the project list after creating a new project
            const updatedProjects = await getProjects(userId);
            setProjects(updatedProjects.data.projects);
            // Clear the form fields
            setProjectName("");
            setDescription("");
            setProjectId(""); // Ensure projectId is cleared as a string


            fetchProjects(); // Fetch projects again to update the joined status
        } catch (error) {
            console.error("Error creating project:", error); // Log the error
            if (error.response && error.response.data && error.response.data.error === "ProjectID already exists") {
                setMessage("ProjectID already exists.");
            } else {
                setMessage("Failed to create project.");
            }
        }
    };


    const handleJoinProjectById = async (e) => {
        e.preventDefault();
        console.log("Joining project with ID:", joinProjectId); // Log the join project ID
        try {
            await addViewer(joinProjectId, userId);
            setMessage("Successfully joined project.");
            setJoinProjectId(""); // Clear the join project ID field


            fetchProjects(); // Fetch projects again to update the joined status
        } catch (error) {
            console.error("Error joining project:", error); // Log the error
            if (error.response && error.response.data && error.response.data.error === "No matching projectID") {
                setMessage("Failed to join project: No matching projectID.");
            } else if (error.response && error.response.data && error.response.data.error === "User is already a viewer of this project") {
                setMessage("User is already a viewer of this project.");
            } else {
                setMessage("Failed to join project.");
            }
        }
    };


    const handleAddViewer = async (projectId, viewerId) => {
        console.log("Attempting to add viewer:", { projectId, viewerId }); // Log the attempt
        try {
            await addViewer(projectId, viewerId);
            setMessage("Viewer added successfully.");
            console.log("Viewer added successfully:", viewerId); // Log success


            fetchProjects(); // Fetch projects again to update the joined status
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
   
            const unitCount = parseInt(units, 10);
            console.log("Unit count after parsing:", unitCount);


            // Update only the specific project's resource count and joined status
            setProjects(prevProjects =>
                prevProjects.map(project =>
                    project._id === projectId
                        ? {
                            ...project,
                            // Subtract units, ensuring the result is at least 0
                            [resourceSet === "HW Set1" ? "hw1" : "hw2"]: Math.max(0, project[resourceSet === "HW Set1" ? "hw1" : "hw2"] - unitCount)
                        }
                        : project
                )
            );


            fetchProjects(); // Fetch projects again to update the joined status


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
                    [resourceSet === "HW Set1" ? "hw1" : "hw2"]: project[resourceSet === "HW Set1" ? "hw1" : "hw2"] + parseInt(units),
                    // Ensure to update the total resources for display
                    totalResources: (project[resourceSet === "HW Set1" ? "hw1" : "hw2"] + parseInt(units)) + ' / 100'
                } : project
            ));


            fetchProjects(); // Fetch projects again to update the joined status
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
            <NavBar userId={userId} />
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
                            value={projectId || ""} // Ensure projectId is a string
                            onChange={(e) => setProjectId(e.target.value)}
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Create Project
                    </Button>
                </Form>


                <Form onSubmit={handleJoinProjectById}>
                    <h2>Join Project by ID</h2>
                    <Form.Group controlId="formJoinProjectId">
                        <Form.Label>Project ID</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Project ID"
                            value={joinProjectId}
                            onChange={(e) => setJoinProjectId(e.target.value)}
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Join Project
                    </Button>
                </Form>


                <div>
                    {projects.length === 0 ? (
                        <p>No projects found.</p>
                    ) : (
                        projects.map((project, index) => {


                            const uniqueKey = project._id && project._id.$oid
                                ? project._id.$oid
                                : JSON.stringify(project._id) || `${project.project_name}-${index}`;
                            console.log("Rendering project with key:", uniqueKey);


                            return (
                                <div key={uniqueKey}>
                                   


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
                            );
                        })
                    )}
                </div>
            </Container>
        </>
    );
};


export default Projects;