import React, { useState } from "react";
import { t } from "../../i18n-simple";
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
        aria-label={todo.completed ? t('Marquer comme non terminée') : t('Marquer comme terminée')}
      />

      {todo.isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          autoFocus
          aria-label={t("Éditer la tâche")}
        />
      ) : (
        <span 
          className="todo-text"
          onDoubleClick={() => actions.startEdit(todo.id)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              actions.startEdit(todo.id);
            }
          }}
        >
          {todo.text}
        </span>
      )}

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button 
          className="archive-btn"
          onClick={() => actions.archiveTodo(todo.id)}
          aria-label={t("Archiver la tâche")}
          title={t("Archiver")}
        >
          📦
        </button>
        <button 
          className="delete-btn"
          onClick={() => actions.deleteTodo(todo.id)}
          aria-label={t("Supprimer la tâche")}
          title={t("Supprimer")}
        >
          🗑️
        </button>
      </div>
    </li>
  );
}
