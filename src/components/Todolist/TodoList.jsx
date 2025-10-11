import React from "react";
import { useTodoContext } from "../../contexts/TodoContext";
import TodoForm from "./TodoForm";
import TodoItem from "./TodoItem";

export default function TodoList() {
  const { selectors } = useTodoContext();
  const todos = selectors.getTodos();
  const stats = selectors.getStats();

  return (
    <div className="todo-list-container">
      <h1>Ma Todo List</h1>
      <p>
        {stats.completed} / {stats.total} tâches terminées • {stats.active} restantes
      </p>

      <TodoForm />
      <ul>
        {todos.length ? (
          todos.map((t) => <TodoItem key={t.id} todo={t} />)
        ) : (
          <div className="empty-state">Aucune tâche</div>
        )}
      </ul>
    </div>
  );
}
