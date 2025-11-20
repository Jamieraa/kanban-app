import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { toast, ToastContainer } from "react-toastify";
import Notifications from "./Notifications";

/**
 * Board reads project from localStorage by projectId.
 * It persists changes back to localStorage so each project maintains its own tasks.
 *
 * Data model for a project stored in localStorage `projects`:
 * { id, name, tasks: [ { id, text, status, deadline, assignees: [], comments: [{user,text,timestamp}] } ], notifications: [ { message, timestamp, read } ] }
 */

function loadProjects() {
  try {
    const raw = localStorage.getItem("projects");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveProjects(projects) {
  localStorage.setItem("projects", JSON.stringify(projects));
}

function nowString() {
  return new Date().toLocaleString();
}

export default function Board({ user }) {
  const { projectId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [tasksLoaded, setTasksLoaded] = useState(false);

  // local editing states
  const [newText, setNewText] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [newAssignees, setNewAssignees] = useState("");
  const [editing, setEditing] = useState({ id: null, text: "" });

  // load project from localStorage on mount or when projectId changes
  useEffect(() => {
    const projects = loadProjects();
    const p = projects.find((x) => x.id === projectId);
    if (!p) {
      // safety: if project not found, redirect to projects
      toast.error("Project not found");
      navigate("/projects");
      return;
    }
    // ensure tasks and notifications arrays exist
    p.tasks = Array.isArray(p.tasks) ? p.tasks : [];
    p.notifications = Array.isArray(p.notifications) ? p.notifications : [];
    setProject(p);
    setTasksLoaded(true);
  }, [projectId]);

  // helper to update project both local state and localStorage
  const persistProject = (updater) => {
    const projects = loadProjects();
    const idx = projects.findIndex((x) => x.id === projectId);
    if (idx === -1) return;
    const copy = JSON.parse(JSON.stringify(projects[idx])); // clone
    updater(copy);
    projects[idx] = copy;
    saveProjects(projects);
    setProject(copy);
  };

  // notification helper
  const pushNotification = (message) => {
    const timestamp = nowString();
    persistProject((p) => {
      p.notifications.unshift({ message, timestamp, read: false });
    });
    toast.info(message);
  };

  // Add new task (owner only)
  const addTask = () => {
    if (!newText.trim()) return toast.error("Enter task description");
    const task = {
      id: "t-" + Date.now(),
      text: newText.trim(),
      status: "To Do",
      deadline: newDeadline || "",
      assignees: newAssignees ? newAssignees.split(",").map(s => s.trim()).filter(Boolean) : [],
      comments: [],
    };
    persistProject((p) => { p.tasks.push(task); });
    pushNotification(`Task "${task.text}" created`);
    setNewText(""); setNewDeadline(""); setNewAssignees("");
  };

  // Delete (owner only)
  const deleteTask = (taskId) => {
    persistProject((p) => { p.tasks = p.tasks.filter((t) => t.id !== taskId); });
    pushNotification(`Task deleted`);
  };

  // Start edit
  const startEdit = (task) => setEditing({ id: task.id, text: task.text });

  const saveEdit = () => {
    persistProject((p) => {
      p.tasks = p.tasks.map((t) => t.id === editing.id ? { ...t, text: editing.text } : t);
    });
    pushNotification(`Task updated`);
    setEditing({ id: null, text: "" });
  };

  // Drag & drop handler (updates status)
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;
    persistProject((p) => {
      const task = p.tasks.find((t) => t.id === draggableId);
      if (!task) return;
      // remove from array position
      // we will keep tasks array as flat list; status controls column placement
      task.status = destination.droppableId;
    });
    pushNotification(`Task moved to ${destination.droppableId}`);
  };

  // Comments (owner and members can comment)
  const addComment = (taskId, text) => {
    if (!text.trim()) return;
    persistProject((p) => {
      p.tasks = p.tasks.map((t) => t.id === taskId ? { ...t, comments: [...t.comments, { user: user.username, text: text.trim(), timestamp: nowString() }] } : t);
    });
    pushNotification(`Comment added`);
  };

  // mark notification read
  const markNotificationRead = (index) => {
    persistProject((p) => {
      if (p.notifications[index]) p.notifications[index].read = true;
    });
    // refresh project state
    const projects = loadProjects();
    setProject(projects.find((x) => x.id === projectId));
  };

  if (!tasksLoaded) {
    return <div style={{ padding: 24, color: "white", background: "#222", minHeight: "100vh" }}>Loading...</div>;
  }

  // safety
  const tasks = project?.tasks || [];
  const notifications = project?.notifications || [];

  // columns are based on status strings
  const columns = [
    { id: "To Do", title: "To Do" },
    { id: "In Progress", title: "In Progress" },
    { id: "Done", title: "Done" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#222", color: "white", padding: 20 }}>
      <ToastContainer position="top-right" autoClose={3000} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ margin: 0 }}>{project.name}</h1>
          <div style={{ color: "#aaa", fontSize: 13 }}>Welcome, {user.username} ({user.role})</div>
        </div>

        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <Notifications notifications={notifications} markRead={markNotificationRead} />
          <button onClick={() => { localStorage.removeItem("user"); window.location.href = "/"; }} style={{ padding: "8px 12px", background: "#0af", color: "white", border: "none", borderRadius: 6 }}>Logout</button>
        </div>
      </div>

      <div style={{ marginTop: 16, display: "flex", gap: 24 }}>
        {/* Left: board */}
        <div style={{ flex: 1 }}>
          {/* Add new task area (owner only) */}
          {user.role === "owner" && (
            <div style={{ background: "#333", padding: 12, borderRadius: 8 }}>
              <div style={{ display: "flex", gap: 8 }}>
                <input value={newText} onChange={(e) => setNewText(e.target.value)} placeholder="Task description" style={{ flex: 1, padding: 8 }} />
                <input type="date" value={newDeadline} onChange={(e) => setNewDeadline(e.target.value)} style={{ padding: 8 }} />
                <input value={newAssignees} onChange={(e) => setNewAssignees(e.target.value)} placeholder="Assignees (comma)" style={{ width: 160, padding: 8 }} />
                <button onClick={addTask} style={{ padding: "8px 12px", background: "#0af", color: "white", border: "none", borderRadius: 6 }}>Add</button>
              </div>
            </div>
          )}

          <div style={{ marginTop: 16 }}>
            <DragDropContext onDragEnd={onDragEnd}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                {columns.map((col) => (
                  <Droppable droppableId={col.id} key={col.id}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps} style={{ background: "#333", padding: 12, borderRadius: 8, minHeight: 300 }}>
                        <h3 style={{ marginTop: 0 }}>{col.title}</h3>

                        {tasks.filter((t) => t.status === col.id).map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(prov) => (
                              <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps} style={{ background: "#444", padding: 10, borderRadius: 6, marginBottom: 8, ...prov.draggableProps.style }}>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                  <div>
                                    <strong>{task.text}</strong>
                                    <div style={{ color: "#bbb", fontSize: 12 }}>Deadline: {task.deadline || "None"}</div>
                                    <div style={{ color: "#bbb", fontSize: 12 }}>Assigned: {task.assignees && task.assignees.length ? task.assignees.join(", ") : "None"}</div>
                                  </div>

                                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                    {user.role === "owner" && (
                                      <>
                                        <button onClick={() => startEdit(task)} style={{ padding: "6px", background: "#0af", color: "white", border: "none", borderRadius: 6 }}>Edit</button>
                                        <button onClick={() => deleteTask(task.id)} style={{ padding: "6px", background: "red", color: "white", border: "none", borderRadius: 6 }}>Delete</button>
                                      </>
                                    )}
                                  </div>
                                </div>

                                {/* comments */}
                                <div style={{ marginTop: 8 }}>
                                  <div style={{ fontSize: 13, color: "#ddd" }}><strong>Comments</strong></div>
                                  {task.comments && task.comments.map((c, i) => (
                                    <div key={i} style={{ fontSize: 13, color: "#ccc" }}>
                                      <em>{c.user}</em>: {c.text} <small style={{ color: "#888" }}>({c.timestamp})</small>
                                    </div>
                                  ))}

                                  <div style={{ marginTop: 6, display: "flex", gap: 8 }}>
                                    <input placeholder="Add comment..." style={{ flex: 1, padding: 8 }} onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        addComment(task.id, e.target.value);
                                        e.target.value = "";
                                      }
                                    }} />
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}

                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                ))}
              </div>
            </DragDropContext>
          </div>
        </div>

      </div>
    </div>
  );
}