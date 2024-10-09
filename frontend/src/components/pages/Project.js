import React, { useState } from "react";
import { createProject, getProjects } from "../../services/api";

const Project = ({ userId }) => {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState("");
  const [projects, setProjects] = useState([]);
  const [message, setMessage] = useState("");

  // Function to handle project creation
  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const response = await createProject(
        userId,
        projectName,
        description,
        projectId
      );
      setMessage(response.data.message);
      loadProjects(); // Reload projects list after creation
      setProjectName(""); // Clear input fields
      setDescription("");
      setProjectId("");
    } catch (error) {
      setMessage("Failed to create project.");
    }
  };

  // Function to load all projects for the user
  const loadProjects = async () => {
    try {
      const response = await getProjects(userId);
      setProjects(response.data.projects);
    } catch (error) {
      console.error("Failed to load projects");
    }
  };

  return (
    <div>
      <h2>Create Project</h2>
      <form onSubmit={handleCreateProject}>
        <input
          type="text"
          placeholder="Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="text"
          placeholder="Project ID"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
        />
        <button type="submit">Create Project</button>
      </form>
      <p>{message}</p>

      <h3>Your Projects</h3>
      <button onClick={loadProjects}>Load Projects</button>
      <ul>
        {projects.map((project) => (
          <li key={project._id}>
            <strong>{project.project_name}</strong>: {project.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Project;
