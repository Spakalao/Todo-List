import React, { useState } from "react";
import { t } from "../../i18n-simple";
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
        placeholder={t("Ajouter une tâche...")}
        onChange={(e) => setInputText(e.target.value)}
      />
      <button type="submit" disabled={!inputText.trim()}>
        {t("Ajouter")}
      </button>

      {state.error && (
        <div className="form-status">
          <div className="error">{state.error}</div>
        </div>
      )}
    </form>
  );
}
