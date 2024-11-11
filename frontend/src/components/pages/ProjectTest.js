import React, { useState } from 'react';
import { Button } from '@mui/material';
import Form from 'react-bootstrap/Form';

const ProjectTest = ({ project, onRemoveViewer, onCheckoutResource, onCheckinResource, onAddViewer, joined }) => {
    const [newViewerId, setNewViewerId] = useState("");
    const [resourceSet, setResourceSet] = useState("HW Set1");
    const [units, setUnits] = useState("");
    const [projectData, setProjectData] = useState(project);

    const handleCheckIn = async (e) => {
        e.preventDefault();
        const result = await onCheckinResource(resourceSet, units);
        setUnits("");

        if (result) {
            setProjectData(prevData => ({
                ...prevData,
                [resourceSet === "HW Set1" ? "hw1" : "hw2"]: prevData[resourceSet === "HW Set1" ? "hw1" : "hw2"] + parseInt(units)
            }));
        } else {
            console.error("Check-in failed or returned no data");
        }
    };

    const handleCheckOut = async (e) => {
        e.preventDefault();
        const result = await onCheckoutResource(resourceSet, units);
        setUnits("");

        if (result) {
            setProjectData(prevData => ({
                ...prevData,
                [resourceSet === "HW Set1" ? "hw1" : "hw2"]: Math.max(0, prevData[resourceSet === "HW Set1" ? "hw1" : "hw2"] - parseInt(units))
            }));
        } else {
            console.error("Check-out failed or returned no data");
        }
    };

    const handleAddViewer = async (e) => {
        e.preventDefault();
        console.log("Adding viewer with ID:", newViewerId);
        const result = await onAddViewer(project._id, newViewerId);
        setNewViewerId("");

        if (result) {
            console.log("Viewer added successfully");
            setProjectData(prevData => ({
                ...prevData,
                viewers: [...prevData.viewers, newViewerId]
            }));
        } else {
            console.error("Failed to add viewer");
        }
    };

    return (
        <div style={{ border: '1px solid black', padding: '10px', margin: '10px' }}>
            <h2>{project.project_name}</h2>
            <p>Users: {(project.viewers || []).join(', ') || 'No users'}</p>
            <p>HWSet1: {project.resources["672b88e1053d6a26a995a710"] > 0 ? project.resources["672b88e1053d6a26a995a710"] : '-'} / 100</p>
            <p>HWSet2: {project.resources["672b88e5053d6a26a995a711"] > 0 ? project.resources["672b88e5053d6a26a995a711"] : '-'} / 100</p>

            {joined ? (
                <>
                    <Form onSubmit={handleAddViewer}>
                        <Form.Group>
                            <Form.Label>Add Viewer User ID</Form.Label>
                            <Form.Control
                                type="text"
                                value={newViewerId}
                                onChange={(e) => setNewViewerId(e.target.value)}
                                style={{ marginBottom: '10px' }}
                            />
                        </Form.Group>
                        <Button variant="contained" color="primary" type="submit">Add Viewer</Button>
                    </Form>

                    <h3>Manage Resources</h3>
                    <Form onSubmit={handleCheckOut}>
                        <Form.Group>
                            <Form.Label>Select Resource Set</Form.Label>
                            <Form.Control
                                as="select"
                                value={resourceSet}
                                onChange={(e) => setResourceSet(e.target.value)}
                                style={{ marginBottom: '10px' }}
                            >
                                <option value="HW Set1">HW Set1</option>
                                <option value="HW Set2">HW Set2</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Units</Form.Label>
                            <Form.Control
                                type="number"
                                value={units}
                                onChange={(e) => setUnits(e.target.value)}
                                style={{ marginBottom: '10px' }}
                            />
                        </Form.Group>
                        <Button variant="contained" color="primary" type="submit">Check Out</Button>
                    </Form>

                    <Form onSubmit={handleCheckIn}>
                        <Form.Group>
                            <Form.Label>Select Resource Set</Form.Label>
                            <Form.Control
                                as="select"
                                value={resourceSet}
                                onChange={(e) => setResourceSet(e.target.value)}
                                style={{ marginBottom: '10px' }}
                            >
                                <option value="HW Set1">HW Set1</option>
                                <option value="HW Set2">HW Set2</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Units</Form.Label>
                            <Form.Control
                                type="number"
                                value={units}
                                onChange={(e) => setUnits(e.target.value)}
                                style={{ marginBottom: '10px' }}
                            />
                        </Form.Group>
                        <Button variant="contained" color="secondary" type="submit">Check In</Button>
                    </Form>
                </>
            ) : (
                <p>You must join the project to interact with it.</p>
            )}
        </div>
    );
};

export default ProjectTest;