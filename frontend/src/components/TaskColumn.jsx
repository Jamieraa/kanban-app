// src/components/TaskColumn.jsx
import React from "react";
import Task from "./Task";
import "../Board.css"; // optional: or make TaskColumn.css if you want

function TaskColumn({ title, tasks, role, onDeleteTask, onEditTask }) {
  return (
    <div className="task-column">
      <h3>{title}</h3>
      {tasks.length === 0 ? (
        <p className="empty-column">No tasks</p>
      ) : (
        tasks.map((task) => (
          <Task
            key={task.id}
            task={task}
            role={role}
            onDeleteTask={onDeleteTask}
            onEditTask={onEditTask}
          />
        ))
      )}
    </div>
  );
}

export default TaskColumn;