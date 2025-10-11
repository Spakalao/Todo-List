import React, {createContext, useReducer, useContext} from "react"

export const TODO_ACTIONS = {
  ADD: "ADD",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
  TOGGLE: "TOGGLE",
  START_EDIT: "START_EDIT",
  CANCEL_EDIT: "CANCEL_EDIT",
  SET_TODOS: "SET_TODOS",
  SET_FILTER: "SET_FILTER",
  CLEAR_COMPLETED: "CLEAR_COMPLETED",
  REORDER: "REORDER",
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  TOGGLE_ALL: "TOGGLE_ALL",
  // etc.
};


export const initialState = {
  todos: [
    { id: 1, text: "Todo 1", isEditing: false, completed: true },
    { id: 2, text: "Todo 2", isEditing: false, completed: false },
    { id: 3, text: "Todo 3", isEditing: false, completed: false },
  ],
  filter: "all", // all, active, completed
  loading: false,
  error: null,
};


const todoReducer = (state, action) => {
  switch (action.type) {
    case TODO_ACTIONS.SET_TODOS:
      return {
        ...state,
        todos: action.payload,
      };

    case TODO_ACTIONS.ADD:
      return {
        ...state,
        todos: [...state.todos, action.payload],
      };
    case TODO_ACTIONS.UPDATE:
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id ? { ...todo, text: action.payload.text, isEditing: false } : todo
        ),
      };
    case TODO_ACTIONS.DELETE:
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload),
      };
    case TODO_ACTIONS.CLEAR_COMPLETED:
      return {
        ...state,
        todos: state.todos.filter(todo => !todo.completed),
      };
    case TODO_ACTIONS.REORDER:
      const { startIndex, endIndex } = action.payload;
      const reorderedTodos = Array.from(state.todos);
      const [movedTodo] = reorderedTodos.splice(startIndex, 1);
      reorderedTodos.splice(endIndex, 0, movedTodo);
      return {
        ...state,
        todos: reorderedTodos,
      };
    case TODO_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case TODO_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case TODO_ACTIONS.TOGGLE:
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo
        ),
      };
    case TODO_ACTIONS.START_EDIT:
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload ? { ...todo, isEditing: true } : todo
        ),
      };
    case TODO_ACTIONS.CANCEL_EDIT:
      return {
        ...state,
        todos: state.todos.map(todo => ({ ...todo, isEditing: false })),
      };
    case TODO_ACTIONS.SET_FILTER:
      return {
        ...state,
        filter: action.payload,
      };
    case TODO_ACTIONS.TOGGLE_ALL:
      return {
        ...state,
        todos: state.todos.map(todo => ({ ...todo, completed: action.payload })),
      };
    default:
      return state;
  }
};

export { todoReducer };
