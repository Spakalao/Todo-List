import React, { useState } from "react";
import { useTodoContext } from "../../contexts/TodoContext";

export default function TodoForm() {
  const [inputText, setInputText] = useState("");
  const { actions, state } = useTodoContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      actions.addTodo(inputText.trim());
      setInputText("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <input
        type="text"
        value={inputText}
        placeholder="Ajouter une tâche..."
        onChange={(e) => setInputText(e.target.value)}
      />
      <button type="submit" disabled={!inputText.trim()}>
        Ajouter
      </button>

      <div className="form-status">
        {state.loading && <span>Chargement...</span>}
        {state.error && <span style={{ color: "red" }}>{state.error}</span>}
      </div>
    </form>
  );
}
