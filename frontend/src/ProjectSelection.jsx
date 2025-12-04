import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "./ProjectSelection.css"; // ← clean CSS file

function makeId() {
  return "p-" + Math.random().toString(36).slice(2, 9);
}

export default function ProjectSelection({ user }) {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const raw = localStorage.getItem("projects");
    const arr = raw
      ? JSON.parse(raw)
      : [
          { id: "p1", name: "Project 1", tasks: [], notifications: [] },
          { id: "p2", name: "Project 2", tasks: [], notifications: [] },
        ];
    setProjects(arr);
  }, []);

  const saveProjects = (updated) => {
    setProjects(updated);
    localStorage.setItem("projects", JSON.stringify(updated));
  };

  const openProject = (proj) => {
    navigate(`/board/${proj.id}`, { state: { projectId: proj.id } });
  };

  const createProject = () => {
    const name = prompt("New project name:");
    if (!name) return;

    const id = makeId();
    const newProj = { id, name, tasks: [], notifications: [] };
    const updated = [...projects, newProj];
    saveProjects(updated);

    toast.success("Project created");
  };

  const deleteProject = (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    const updated = projects.filter((p) => p.id !== id);
    saveProjects(updated);
    toast.info("Project deleted");
  };

  const renameProject = (id) => {
    const newName = prompt("Enter new project name:");
    if (!newName) return;

    const updated = projects.map((p) =>
      p.id === id ? { ...p, name: newName } : p
    );
    saveProjects(updated);
    toast.success("Project renamed");
  };

  return (
    <div className="project-page">
      <ToastContainer position="top-right" autoClose={2500} />

      {/* Top bar */}
      <div className="project-topbar">
        <div className="project-topbar-left"></div>

        <h1 className="project-title">
          Welcome, {user.username}
        </h1>

        <div className="project-topbar-right">
          <button
            onClick={() => {
              localStorage.removeItem("user");
              navigate("/");
            }}
            className="logout-btn"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="project-centered">
        <div className="welcome-text">Your Projects</div>
        <div className="select-text">Select or create a project</div>
      </div>

      {/* Project Grid */}
      <div className="project-grid">
        {projects.map((p) => (
          <div key={p.id} className="project-card">
            <div className="project-name">{p.name}</div>

            <div className="project-buttons">
              <button onClick={() => openProject(p)} className="btn blue">
                Open
              </button>

              <button onClick={() => renameProject(p.id)} className="btn orange">
                Edit
              </button>

              <button onClick={() => deleteProject(p.id)} className="btn red">
                Delete
              </button>
            </div>
          </div>
        ))}

        {/* Create new card */}
        <div className="project-card create-card">
          <div className="project-name">Create New Project</div>
          <button onClick={createProject} className="btn blue">
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
