import NavBar from "../elements/Navbar";
import Button from "react-bootstrap/esm/Button";

const Home = () => {
  return (
    <>
      <NavBar />
      <p>This is the homepage.</p>
      <Button href="/projects">Projects</Button>
      <Button href="/resources">Resources</Button>
      <Button href="/login">Back to Login</Button>
    </>
  );
};
export default Home;
