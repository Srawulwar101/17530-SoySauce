import React from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";

function NavBar({ userId }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Navbar className="bg-body-tertiary navbar-custom">
      <Container>
        <Navbar.Brand href="/home">HaaS PoC App</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          {userId && (
            <>
              <Navbar.Text>
                Signed in as: <span>{userId}</span>
              </Navbar.Text>
              <Button 
                variant="danger"
                onClick={handleLogout}
                style={{
                  marginLeft: '10px',
                  padding: '10px 20px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  transition: 'background-color 0.3s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c82333'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
              >
                Logout
              </Button>
            </>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
