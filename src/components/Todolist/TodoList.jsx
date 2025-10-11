import React from "react";
import { t } from "../../i18n-simple";
import { useTodoContext } from "../../contexts/TodoContext";
import TodoForm from "./TodoForm";
import TodoItem from "./TodoItem";

export default function TodoList() {
  const { selectors } = useTodoContext();
  const todos = selectors.getTodos();
  const stats = selectors.getStats();

  return (
    <div className="todo-list-container">
      <div className="todo-header">
        <h1>{t('Ma Todo List')}</h1>
        <div className="todo-stats">
          {stats.completed} / {stats.total} {t('tâches terminées')} • {stats.active} {t('restantes')}
        </div>
      </div>

      <div className="todo-content">
        <TodoForm />
        
        {todos.length ? (
          <ul className="todos-list">
            {todos.map((t) => <TodoItem key={t.id} todo={t} />)}
          </ul>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📝</div>
            <div className="empty-state-text">{t('Aucune tâche')}</div>
            <div className="empty-state-subtext">{t('Ajoutez votre première tâche ci-dessus')}</div>
          </div>
        )}
      </div>
    </div>
  );
}
