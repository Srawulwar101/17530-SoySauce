import React, {useState} from 'react';
import {Button, TextField} from '@mui/material';

const Project = ({project}) => {
    const [joined, setJoined] = useState(project.joined);
    const [quantity, setQuantity] = useState(0);

    const handleJoinLeave = () => {
        setJoined(!joined);
    };

    const handleCheckIn = () => {
        console.log('Checked in ${quanitity} items to ${project.name}');
    };

    const handleCheckOut = () => {
        console.log('Checked out ${quanitity} items from ${project.name}');
    };

    return (
        <div style={{border: '1px solid black', padding: '10px', margin: '10px'}}>
            <h2>{project.name}</h2>
            <p>Users: {project.users.join(', ') || 'No users'}</p>
            <p>HWSet1: {project.hw1}/100</p>
            <p>HWSet2: {project.hw2}/100</p>

            <TextField
                type="number"
                label="Enter qty"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                style={{ marginRight: '10px' }}
            />
            <Button variant="contained" color="primary" onClick={handleCheckIn}>Check In</Button>
            <Button variant="contained" color="secondary" onClick={handleCheckOut} style={{ marginLeft: '10px' }}>Check Out</Button>

            <Button
                variant="contained"
                color={joined ? 'error' : 'success'}
                onClick={handleJoinLeave}
                style={{ marginLeft: '10px' }}
            >
                {joined ? 'Leave' : 'Join'}
            </Button>
        </div>
    );
};

export default Project;