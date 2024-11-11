import React from "react";
import NavBar from "../elements/Navbar";
import Button from "react-bootstrap/esm/Button";

const Home = () => {
  const userId = localStorage.getItem("userId"); // Retrieve userId from local storage

  // Inline styles
  const styles = {
    container: {
      textAlign: 'center',
      padding: '20px',
      // backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      // boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    button: {
      marginTop: '20px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
    },
    buttonHover: {
      backgroundColor: '#0056b3',
    },
  };

  return (
    <div style={styles.container}> {/* Added a container for styling */}
      <NavBar userId={userId} /> {/* Pass userId to NavBar */}
      <h1>Welcome to the your landing page</h1> {/* Added a header */}
      <p>Feel free to view, create, and join projects</p>
      <p>Everything you need, all in one place</p>
      <Button 
        style={styles.button} 
        href="/projects" 
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor} 
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.button.backgroundColor}
      >
        View Projects
      </Button> {/* Updated button styling */}
    </div>
  );
};

export default Home;
