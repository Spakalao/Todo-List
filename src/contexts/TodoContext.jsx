import React, { createContext, useContext, useEffect, useReducer } from "react";
import {
  TODO_ACTIONS,
  todoReducer,
  initialState as todoInitialState,
} from "../reducers/TodoReducer";

const TodoContext = createContext();

export const useTodoContext = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error("useTodoContext must be used within TodoProvider");
  }
  return context;
};

export const TodoProvider = ({ children }) => {
  const [state, dispatch] = useReducer(todoReducer, todoInitialState);

  // Action creators avec mise à jour optimiste
  const actions = {
    addTodo: (text) => {
      dispatch({
        type: TODO_ACTIONS.ADD,
        payload: {
          id: Date.now(),
          text,
          isEditing: false,
          completed: false,
        },
      });
    },
    updateTodo: (id, text) => {
      dispatch({
        type: TODO_ACTIONS.UPDATE,
        payload: { id, text },
      });
    },
    deleteTodo: (id) => {
      dispatch({
        type: TODO_ACTIONS.DELETE,
        payload: id,
      });
    },
    clearCompleted: () => {
      dispatch({
        type: TODO_ACTIONS.CLEAR_COMPLETED,
      });
    },
    toggleAll: (completed) => {
      dispatch({
        type: TODO_ACTIONS.TOGGLE_ALL,
        payload: completed,
      });
    },
    setFilter: (filter) => {
      dispatch({
        type: TODO_ACTIONS.SET_FILTER,
        payload: filter,
      });
    },
    startEdit: (id) => {
      dispatch({
        type: TODO_ACTIONS.START_EDIT,
        payload: id,
      });
    },
    cancelEdit: () => {
      dispatch({
        type: TODO_ACTIONS.CANCEL_EDIT,
      });
    },
    reorderTodos: (startIndex, endIndex) => {
      dispatch({
        type: TODO_ACTIONS.REORDER,
        payload: { startIndex, endIndex },
      });
    },  
    toggleTodo: (id) => {
      dispatch({
        type: TODO_ACTIONS.TOGGLE,
        payload: id,
      });
    },
    setLoading: (isLoading) => {
      dispatch({
        type: TODO_ACTIONS.SET_LOADING,
        payload: isLoading,
      });
    },
    setError: (error) => {
      dispatch({
        type: TODO_ACTIONS.SET_ERROR,
        payload: error,
      });
    },
    setTodos: (todos) => {
      dispatch({
        type: TODO_ACTIONS.SET_TODOS,
        payload: todos,
      });
    },

    // TODO: Ajoutez les autres méthodes pour les actions définies dans le reducer
  };

  // Sélecteurs (computed values)
  const selectors = {
    getTodos: () => {
      switch (state.filter) {
        case "active":
          return state.todos.filter((todo) => !todo.completed);
        case "completed":
          return state.todos.filter((todo) => todo.completed);
        default:
          return state.todos;
      }
    },
  };

  const value = {
    state,
    actions,
    selectors,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};
