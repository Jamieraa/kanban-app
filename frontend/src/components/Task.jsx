function Task({ task, role, deleteTask, updateTask, changeTaskStatus }) {
  const handleEdit = () => {
    const newAssignee = prompt("Enter assignee:", task.assignee || "");
    const newDue = prompt("Enter due date (YYYY-MM-DD):", task.due || "");
    const updatedTask = { ...task, assignee: newAssignee, due: newDue };
    updateTask(task.id, updatedTask);
  };

  return (
    <div className="bg-white text-black p-3 rounded-lg shadow mb-3">
      <h4 className="font-semibold">{task.title}</h4>
      <p className="text-sm text-gray-600">
        Assignee: {task.assignee || "—"} <br />
        Due: {task.due || "—"}
      </p>

      {/* Only show buttons if role = owner */}
      {role === "owner" && (
        <div className="mt-2 flex gap-2">
          <button
            onClick={handleEdit}
            className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
          >
            Edit
          </button>
          <button
            onClick={() => deleteTask(task.id)}
            className="bg-red-500 text-white px-2 py-1 rounded text-sm"
          >
            Delete
          </button>
          <select
            value={task.status}
            onChange={(e) => changeTaskStatus(task.id, e.target.value)}
            className="px-2 py-1 rounded text-sm"
          >
            <option>To Do</option>
            <option>In Progress</option>
            <option>Done</option>
          </select>
        </div>
      )}
    </div>
  );
}

export default Task;
