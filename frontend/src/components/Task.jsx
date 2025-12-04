
import React, { useState } from "react";
import "../Board.css";

export default function Task({
  task,
  column,
  onDelete,
  onEdit,
  onComment,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDeadline, setEditedDeadline] = useState(task.deadline || "");
  const [editedAssigned, setEditedAssigned] = useState(task.assignedTo || "");
  const [commentText, setCommentText] = useState("");

  const handleSave = () => {
    onEdit(task.id, editedTitle, editedDeadline, editedAssigned);
    setIsEditing(false);
  };

  const handleCommentSubmit = () => {
    if (!commentText.trim()) return;
    onComment(task.id, commentText);
    setCommentText("");
  };

  return (
    <div
      className="task-card"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("taskId", task.id);
        e.dataTransfer.setData("fromColumn", column);
      }}
    >
      {isEditing ? (
        <>
          <input
            className="task-input"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            placeholder="Task title"
          />

          <input
            className="task-input"
            type="date"
            value={editedDeadline}
            onChange={(e) => setEditedDeadline(e.target.value)}
          />

          <input
            className="task-input"
            value={editedAssigned}
            placeholder="Assigned to..."
            onChange={(e) => setEditedAssigned(e.target.value)}
          />

          <button className="save-btn" onClick={handleSave}>
            Save
          </button>
        </>
      ) : (
        <>
          <h4 className="task-title">{task.title}</h4>

          {task.deadline && (
            <p className="task-info">
              <strong>Deadline:</strong> {task.deadline}
            </p>
          )}

          {task.assignedTo && (
            <p className="task-info">
              <strong>Assigned:</strong> {task.assignedTo}
            </p>
          )}

          <div className="comments-section">
            <strong>Comments</strong>

            {(task.comments || []).map((c, i) => (
              <p key={i} className="comment-item">
                • {c}
              </p>
            ))}

            <input
              className="comment-input"
              placeholder="Add comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />

            <button className="comment-btn" onClick={handleCommentSubmit}>
              Submit
            </button>
          </div>

          <div className="task-actions">
            <button className="edit-btn" onClick={() => setIsEditing(true)}>
              Edit
            </button>

            <button className="delete-btn" onClick={() => onDelete(task.id)}>
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}
