import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div>
            <h1>Welcome to the Home Page</h1>
            <Button variant="contained" color="primary" onClick={() => navigate('/projects')}>
                Projects
            </Button>
            <Button variant="contained" color="primary" onClick={() => navigate('/resources')}>
                Resources
            </Button>
            <Button variant="contained" color="primary" onClick={() => navigate('/test')}>
                Test
            </Button>
            <Button variant="contained" color="secondary" onClick={() => navigate('/login')}>
                Back to Login
            </Button>
        </div>
    );
};

export default Home;
