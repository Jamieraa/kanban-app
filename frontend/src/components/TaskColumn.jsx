// src/components/TaskColumn.jsx
import React from "react";
import Task from "./Task";
import "../Board.css";

function TaskColumn({ title, tasks, role, deleteTask, updateTask, changeTaskStatus }) {
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
            deleteTask={deleteTask}
            updateTask={updateTask}
            changeTaskStatus={changeTaskStatus}
          />
        ))
      )}
    </div>
  );
}

export default TaskColumn;
