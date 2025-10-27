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
  ARCHIVE_TODO: "ARCHIVE_TODO",
  RESTORE_TODO: "RESTORE_TODO",
  DELETE_ARCHIVED: "DELETE_ARCHIVED",
  // etc.
};


// Fonction pour charger l'état depuis localStorage
const loadStateFromStorage = () => {
  try {
    const storedState = localStorage.getItem('todo-app-state');
    if (storedState) {
      const parsed = JSON.parse(storedState);
      // Vérifier que les données sont valides
      if (parsed.todos && Array.isArray(parsed.todos) && 
          parsed.archivedTodos && Array.isArray(parsed.archivedTodos)) {
        return {
          ...parsed,
          loading: false,
          error: null,
        };
      }
    }
  } catch (error) {
    console.error('Erreur lors du chargement du localStorage:', error);
  }
  // Retourner l'état initial par défaut
  return {
    todos: [],
    archivedTodos: [],
    filter: "all",
    loading: false,
    error: null,
  };
};

export const initialState = loadStateFromStorage();

// Fonction pour sauvegarder l'état dans localStorage
const saveStateToStorage = (state) => {
  try {
    // Ne sauvegarder que les données importantes, pas loading ni error
    const stateToSave = {
      todos: state.todos,
      archivedTodos: state.archivedTodos,
      filter: state.filter,
    };
    localStorage.setItem('todo-app-state', JSON.stringify(stateToSave));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde dans localStorage:', error);
  }
};

const todoReducer = (state, action) => {
  let newState;
  
  switch (action.type) {
    case TODO_ACTIONS.SET_TODOS:
      newState = {
        ...state,
        todos: action.payload,
      };
      break;

    case TODO_ACTIONS.ADD:
      newState = {
        ...state,
        todos: [...state.todos, action.payload],
      };
      break;
      
    case TODO_ACTIONS.UPDATE:
      newState = {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id ? { ...todo, text: action.payload.text, isEditing: false } : todo
        ),
      };
      break;
      
    case TODO_ACTIONS.DELETE:
      newState = {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload),
      };
      break;
      
    case TODO_ACTIONS.CLEAR_COMPLETED:
      newState = {
        ...state,
        todos: state.todos.filter(todo => !todo.completed),
      };
      break;
      
    case TODO_ACTIONS.REORDER:
      const { startIndex, endIndex } = action.payload;
      const reorderedTodos = Array.from(state.todos);
      const [movedTodo] = reorderedTodos.splice(startIndex, 1);
      reorderedTodos.splice(endIndex, 0, movedTodo);
      newState = {
        ...state,
        todos: reorderedTodos,
      };
      break;
      
    case TODO_ACTIONS.SET_LOADING:
      // Ne pas sauvegarder les états de chargement/erreur
      return {
        ...state,
        loading: action.payload,
      };
      
    case TODO_ACTIONS.SET_ERROR:
      // Ne pas sauvegarder les états de chargement/erreur
      return {
        ...state,
        error: action.payload,
      };
      
    case TODO_ACTIONS.TOGGLE:
      newState = {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo
        ),
      };
      break;
      
    case TODO_ACTIONS.START_EDIT:
      newState = {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload ? { ...todo, isEditing: true } : todo
        ),
      };
      break;
      
    case TODO_ACTIONS.CANCEL_EDIT:
      newState = {
        ...state,
        todos: state.todos.map(todo => ({ ...todo, isEditing: false })),
      };
      break;
      
    case TODO_ACTIONS.SET_FILTER:
      newState = {
        ...state,
        filter: action.payload,
      };
      break;
      
    case TODO_ACTIONS.TOGGLE_ALL:
      newState = {
        ...state,
        todos: state.todos.map(todo => ({ ...todo, completed: action.payload })),
      };
      break;
      
    case TODO_ACTIONS.ARCHIVE_TODO:
      const todoToArchive = state.todos.find(todo => todo.id === action.payload);
      if (!todoToArchive) return state;
      
      newState = {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload),
        archivedTodos: [...state.archivedTodos, { ...todoToArchive, archivedAt: Date.now() }],
      };
      break;
      
    case TODO_ACTIONS.RESTORE_TODO:
      const todoToRestore = state.archivedTodos.find(todo => todo.id === action.payload);
      if (!todoToRestore) return state;
      
      newState = {
        ...state,
        todos: [...state.todos, todoToRestore],
        archivedTodos: state.archivedTodos.filter(todo => todo.id !== action.payload),
      };
      break;
      
    case TODO_ACTIONS.DELETE_ARCHIVED:
      newState = {
        ...state,
        archivedTodos: state.archivedTodos.filter(todo => todo.id !== action.payload),
      };
      break;
      
    default:
      return state;
  }
  
  // Sauvegarder dans localStorage après chaque action
  saveStateToStorage(newState);
  return newState;
};

export { todoReducer };
