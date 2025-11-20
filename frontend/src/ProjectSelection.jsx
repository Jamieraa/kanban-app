import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

/**
 * Projects are stored in localStorage under "projects" as array:
 * { id: "p-1", name: "Project 1", tasks: [...], notifications: [...] }
 */

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
    const name = prompt("New project name");
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
    <div style={{ minHeight: "100vh", background: "#222", color: "white", padding: 24 }}>
      <ToastContainer position="top-right" autoClose={2500} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>
          Welcome, {user.username} ({user.role})
        </h1>
        <div>
          <button
            onClick={() => {
              localStorage.removeItem("user");
              navigate("/");
            }}
            style={{
              padding: "8px 12px",
              background: "#0af",
              color: "white",
              border: "none",
              borderRadius: 6,
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <h2 style={{ marginTop: 24 }}>Select a Project</h2>
      <div style={{ display: "flex", gap: 12, marginTop: 12, flexWrap: "wrap" }}>
        {projects.map((p) => (
          <div
            key={p.id}
            style={{
              background: "#333",
              padding: 12,
              borderRadius: 8,
              minWidth: 160,
              position: "relative",
            }}
          >
            <div style={{ fontWeight: "bold" }}>{p.name}</div>
            <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
              <button
                onClick={() => openProject(p)}
                style={{
                  padding: "6px 10px",
                  background: "#0af",
                  color: "white",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                }}
              >
                Open
              </button>

              <button
                onClick={() => renameProject(p.id)}
                style={{
                  padding: "6px 10px",
                  background: "#fa0",
                  color: "white",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                }}
              >
                ✏️ Edit
              </button>

              <button
                onClick={() => deleteProject(p.id)}
                style={{
                  padding: "6px 10px",
                  background: "#d33",
                  color: "white",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                }}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}

        <div style={{ background: "#333", padding: 12, borderRadius: 8, minWidth: 160 }}>
          <div style={{ fontWeight: "bold" }}>Create New Project</div>
          <div style={{ marginTop: 8 }}>
            <button
              onClick={createProject}
              style={{
                padding: "6px 10px",
                background: "#0af",
                color: "white",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}