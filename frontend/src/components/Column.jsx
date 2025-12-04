import React from "react";
import Task from "./Task";

function Column({
  title,
  tasks,
  role,
  deleteTask,
  updateTask,
  changeTaskStatus,
  onDragStart,
  onDragOver,
  onDrop,
}) {
  return (
    <div
      className="task-column"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, title)}
    >
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
            onDragStart={onDragStart}
          />
        ))
      )}
    </div>
  );
}

export default Column;
