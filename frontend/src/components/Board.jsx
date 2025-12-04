import React, { useState } from "react";
import "../Board.css";
import Task from "./Task";

const initialColumns = {
  todo: {
    key: "todo",
    title: "To Do",
    tasks: [],
  },
  inProgress: {
    key: "inProgress",
    title: "In Progress",
    tasks: [
      {
        id: "example-1",
        title: "Example Task",
        deadline: "2025-10-31",
        assignedTo: "Saviya",
        comments: [],
      },
    ],
  },
  done: {
    key: "done",
    title: "Done",
    tasks: [],
  },
};

const initialNotifications = [
  {
    id: 1,
    message: "Task moved to In Progress",
    time: "11/21/2023, 8:42:48 PM",
    read: false,
  },
  {
    id: 2,
    message: "Task moved to In Progress",
    time: "10/21/2025, 12:28:18 PM",
    read: false,
  },
  {
    id: 3,
    message: "Task moved to In Progress",
    time: "16/24/2025, 12:44:06 PM",
    read: false,
  },
];

const columnTitles = {
  todo: "To Do",
  inProgress: "In Progress",
  done: "Done",
};

export default function Board({
  projectName = "Project 1",
  userName = "admin",
  role = "owner",
  onLogout,
}) {
  const [columns, setColumns] = useState(initialColumns);
  const [newTitle, setNewTitle] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [notifications, setNotifications] = useState(initialNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // ----------------------------
  // ADD TASK (goes to "To Do")
  // ----------------------------
  const handleAddTask = () => {
    if (!newTitle.trim()) return;

    const task = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      deadline: newDeadline || "",
      assignedTo: "",
      comments: [],
    };

    setColumns((prev) => ({
      ...prev,
      todo: {
        ...prev.todo,
        tasks: [...prev.todo.tasks, task],
      },
    }));

    setNewTitle("");
    setNewDeadline("");
  };

  // ----------------------------
  // DELETE TASK
  // ----------------------------
  const handleDeleteTask = (taskId, columnKey) => {
    setColumns((prev) => ({
      ...prev,
      [columnKey]: {
        ...prev[columnKey],
        tasks: prev[columnKey].tasks.filter((t) => t.id !== taskId),
      },
    }));
  };

  // ----------------------------
  // EDIT TASK
  // ----------------------------
  const handleEditTask = (
    taskId,
    title,
    deadline,
    assignedTo,
    columnKey
  ) => {
    setColumns((prev) => ({
      ...prev,
      [columnKey]: {
        ...prev[columnKey],
        tasks: prev[columnKey].tasks.map((t) =>
          t.id === taskId ? { ...t, title, deadline, assignedTo } : t
        ),
      },
    }));
  };

  // ----------------------------
  // ADD COMMENT
  // ----------------------------
  const handleAddComment = (taskId, text, columnKey) => {
    if (!text.trim()) return;
    setColumns((prev) => ({
      ...prev,
      [columnKey]: {
        ...prev[columnKey],
        tasks: prev[columnKey].tasks.map((t) =>
          t.id === taskId
            ? { ...t, comments: [...(t.comments || []), text] }
            : t
        ),
      },
    }));
  };

  // ----------------------------
  // DRAG & DROP
  // ----------------------------
  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e, toColumnKey) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    const fromColumnKey = e.dataTransfer.getData("fromColumn");

    if (!taskId || !fromColumnKey || fromColumnKey === toColumnKey) return;

    setColumns((prev) => {
      const fromTasks = [...prev[fromColumnKey].tasks];
      const taskIndex = fromTasks.findIndex(
        (t) => String(t.id) === String(taskId)
      );
      if (taskIndex === -1) return prev;

      const [movedTask] = fromTasks.splice(taskIndex, 1);
      const toTasks = [...prev[toColumnKey].tasks, movedTask];

      return {
        ...prev,
        [fromColumnKey]: { ...prev[fromColumnKey], tasks: fromTasks },
        [toColumnKey]: { ...prev[toColumnKey], tasks: toTasks },
      };
    });

    // Add notification
    setNotifications((prev) => [
      ...prev,
      {
        id: Date.now(),
        message: `Task moved to ${columnTitles[toColumnKey]}`,
        time: new Date().toLocaleString(),
        read: false,
      },
    ]);
  };

  // ----------------------------
  // NOTIFICATIONS
  // ----------------------------
  const handleMarkRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    } else {
      console.log("Logout clicked");
    }
  };

  return (
    <div className="board-page">
      {/* TOP-RIGHT LOGOUT BUTTON */}
      <button className="logout-btn" onClick={handleLogoutClick}>
        Logout
      </button>

      <div className="board-wrapper">
        {/* MAIN BOARD */}
        <div className="board-main">
          <div className="board-header">
            <h1>{projectName}</h1>
            <p>
              Welcome, {userName} ({role})
            </p>
          </div>

          {/* INPUT ROW */}
          <div className="task-input-row">
            <input
              className="top-input"
              placeholder="Task description"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <input
              className="top-input"
              type="date"
              value={newDeadline}
              onChange={(e) => setNewDeadline(e.target.value)}
              placeholder="mm / dd / yyyy"
            />
            <button className="add-btn" onClick={handleAddTask}>
              Add
            </button>
          </div>

          {/* COLUMNS */}
          <div className="columns-row">
            {["todo", "inProgress", "done"].map((key) => (
              <div
                key={key}
                className="task-column"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, key)}
              >
                <h3 className="column-title">{columns[key].title}</h3>

                {columns[key].tasks.length === 0 ? (
                  <p className="empty-column"></p>
                ) : (
                  columns[key].tasks.map((task) => (
                    <Task
                      key={task.id}
                      task={task}
                      column={key}
                      onDelete={(id) => handleDeleteTask(id, key)}
                      onEdit={(id, title, deadline, assignedTo) =>
                        handleEditTask(id, title, deadline, assignedTo, key)
                      }
                      onComment={(id, text) => handleAddComment(id, text, key)}
                    />
                  ))
                )}
              </div>
            ))}
          </div>
        </div>

        {/* NOTIFICATIONS PANEL */}
        <div className="notifications-panel">
          <div className="notifications-header">
            <h2>Notifications</h2>
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </div>

          <div className="notifications-list">
            {notifications.length === 0 ? (
              <p className="empty-notifications">No notifications</p>
            ) : (
              notifications.map((n) => (
                <div key={n.id} className="notification-card">
                  <p className="notification-title">{n.message}</p>
                  <p className="notification-time">{n.time}</p>
                  <div className="notification-footer">
                    <div className="notification-placeholder" />
                    <button
                      className="mark-read-btn"
                      onClick={() => handleMarkRead(n.id)}
                    >
                      Mark read
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
