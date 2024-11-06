import React, { useState, useEffect } from 'react';
import { Button, TextField } from '@mui/material';

const ProjectTest = ({ project, userId }) => {
    const [joined, setJoined] = useState(false);
    const [quantity, setQuantity] = useState(0);
    const [newUserId, setNewUserId] = useState('');

    useEffect(() => {
        // Check if the user is already part of the project
        if (project.users.includes(userId)) {
            setJoined(true);
        }
    }, [project.users, userId]);

    const handleJoinLeave = () => {
        if (joined) {
            // Handle leaving the project
            const updatedUsers = project.users.filter(user => user !== userId);
            project.users = updatedUsers;
            setJoined(false);
        } else {
            // Handle joining the project
            project.users.push(userId);
            setJoined(true);
        }
    };

    const handleCheckIn = () => {
        console.log(`Checked in ${quantity} items to ${project.name}`);
    };

    const handleCheckOut = () => {
        console.log(`Checked out ${quantity} items from ${project.name}`);
    };

    const handleAddUser = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/projects/add_user_to_project', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    project_id: project.project_id,
                    new_user_id: newUserId
                }),
            });

            if (response.ok) {
                const result = await response.json();
                console.log(result.message);
                project.users.push(newUserId);
                setNewUserId('');
            } else {
                console.error('Failed to add user to project');
            }
        } catch (error) {
            console.error('Error adding user to project:', error);
        }
    };

    return (
        <div style={{ border: '1px solid black', padding: '10px', margin: '10px' }}>
            <h2>{project.name}</h2>
            <p>Users: {project.users.join(', ') || 'No users'}</p>
            <p>HWSet1: {project.hw1}/100</p>
            <p>HWSet2: {project.hw2}/100</p>

            <TextField
                type="number"
                label="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={handleCheckIn}>Check In</Button>
            <Button variant="contained" color="secondary" onClick={handleCheckOut}>Check Out</Button>
            <Button variant="contained" color="default" onClick={handleJoinLeave}>
                {joined ? 'Leave' : 'Join'}
            </Button>

            <div style={{ marginTop: '10px' }}>
                <TextField
                    label="New User ID"
                    value={newUserId}
                    onChange={(e) => setNewUserId(e.target.value)}
                />
                <Button variant="contained" color="primary" onClick={handleAddUser}>Add User</Button>
            </div>
        </div>
    );
};

export default ProjectTest;