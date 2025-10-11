import React, { createContext, useContext, useEffect, useReducer } from "react";
import {
  TODO_ACTIONS,
  todoReducer,
  initialState as todoInitialState,
} from "../reducers/TodoReducer";
import { useTodoApi } from "../hooks/useTodoApi";

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
  
  // Hook API
  const {
    todos: apiTodos,
    loading: apiLoading,
    error: apiError,
    fetchTodos,
    addTodo: apiAddTodo,
    updateTodo: apiUpdateTodo,
    deleteTodo: apiDeleteTodo,
  } = useTodoApi();

  // Charger les todos au montage du composant
  useEffect(() => {
    fetchTodos();
  }, []);

  // Synchroniser les todos de l'API avec le state du reducer
  useEffect(() => {
    dispatch({
      type: TODO_ACTIONS.SET_TODOS,
      payload: apiTodos,
    });
  }, [apiTodos]);

  // Synchroniser les états de loading et error
  useEffect(() => {
    dispatch({
      type: TODO_ACTIONS.SET_LOADING,
      payload: apiLoading,
    });
  }, [apiLoading]);

  useEffect(() => {
    if (apiError) {
      dispatch({
        type: TODO_ACTIONS.SET_ERROR,
        payload: apiError,
      });
    }
  }, [apiError]);

  // Action creators avec mise à jour optimiste
  const actions = {
    addTodo: async (text) => {
      try {
        dispatch({
          type: TODO_ACTIONS.SET_ERROR,
          payload: null,
        });
        await apiAddTodo(text);
      } catch (error) {
        // L'erreur est déjà gérée dans le hook
        console.error('Erreur lors de l\'ajout:', error);
      }
    },
    updateTodo: async (id, text) => {
      try {
        dispatch({
          type: TODO_ACTIONS.SET_ERROR,
          payload: null,
        });
        await apiUpdateTodo(id, text);
      } catch (error) {
        console.error('Erreur lors de la mise à jour:', error);
      }
    },
    deleteTodo: async (id) => {
      try {
        dispatch({
          type: TODO_ACTIONS.SET_ERROR,
          payload: null,
        });
        await apiDeleteTodo(id);
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
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
    getStats: () => {
      const total = state.todos.length;
      const completed = state.todos.filter((todo) => todo.completed).length;
      const active = total - completed;
      return { total, completed, active };
    },
  };

  const value = {
    state,
    actions,
    selectors,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};
