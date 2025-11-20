import React from "react";

function Column({ title, tasks, role, onAddTask, onUpdateTask, onDeleteTask }) {
  return (
    <div className="flex flex-col bg-gray-100 rounded-lg shadow-md p-4">
      <h2 className="text-xl font-bold mb-4 text-center">{title}</h2>

      {tasks.map((task) => (
        <div
          key={task.id}
          className="bg-white p-2 mb-2 rounded shadow-sm flex justify-between items-center"
        >
          <span>{task.title}</span>
          {role === "Owner" && (
            <div className="space-x-2">
              <button
                onClick={() => onUpdateTask(task.id)}
                className="text-blue-500"
              >
                Edit
              </button>
              <button
                onClick={() => onDeleteTask(task.id)}
                className="text-red-500"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ))}

      {role === "Owner" && (
        <button
          onClick={onAddTask}
          className="mt-2 px-2 py-1 bg-green-500 text-white rounded w-full"
        >
          + Add Task
        </button>
      )}
    </div>
  );
}

export default Column;