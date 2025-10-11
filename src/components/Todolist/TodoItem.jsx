import React, { useState } from "react";
import { useTodoContext } from "../../contexts/TodoContext";

export default function TodoItem({ todo }) {
  const { actions } = useTodoContext();
  const [editText, setEditText] = useState(todo.text);

  const handleSave = () => {
    if (editText.trim()) actions.updateTodo(todo.id, editText.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") actions.cancelEdit(todo.id);
  };

  return (
    <li className={`todo-item ${todo.completed ? "completed" : ""}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => actions.toggleTodo(todo.id)}
      />

      {todo.isEditing ? (
        <input
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      ) : (
        <span onDoubleClick={() => actions.startEdit(todo.id)}>{todo.text}</span>
      )}

      <button onClick={() => actions.deleteTodo(todo.id)}>🗑️</button>
    </li>
  );
}
