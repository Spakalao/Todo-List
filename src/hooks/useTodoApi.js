import { useState } from "react";

const BASE_URL = "https://dummyjson.com";
export const USER_ID = 1;

export const useTodoApi = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Récupérer tous les todos
  const fetchTodos = async (limit = 10) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${BASE_URL}/todos?limit=${limit}`);

      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }

      const data = await response.json();
      // Adapter les données de l'API au format local
      const adaptedTodos = data.todos.map((todo) => ({
        id: todo.id,
        text: todo.todo,
        completed: todo.completed,
        isEditing: false,
        userId: todo.userId,
      }));

      setTodos(adaptedTodos);
    } catch (err) {
      setError(err.message);
      throw err; // Relancer l'erreur pour le contexte
    } finally {
      setLoading(false);
    }
  };

  // Ajouter une todo
  const addTodo = async (text) => {
    try {
      setError(null);
      
      const response = await fetch(`${BASE_URL}/todos/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          todo: text,
          completed: false,
          userId: USER_ID,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }

      const newTodo = await response.json();
      
      // Adapter la réponse de l'API
      const adaptedTodo = {
        id: newTodo.id === 255 ? Math.max(...todos.map(t => t.id), 0) + 1 : newTodo.id,
        text: newTodo.todo,
        completed: newTodo.completed,
        isEditing: false,
        userId: newTodo.userId,
      };

      setTodos(prev => [...prev, adaptedTodo]);
      return adaptedTodo;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Mettre à jour une todo
  const updateTodo = async (id, text) => {
    try {
      setError(null);
      
      // Si c'est une todo locale (id > 255), on la met à jour localement
      if (id > 255) {
        setTodos(prev => prev.map(todo => 
          todo.id === id ? { ...todo, text } : todo
        ));
        return;
      }

      const response = await fetch(`${BASE_URL}/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          todo: text,
        }),
      });

      if (!response.ok) {
        if (response.status === 404) {
          // Todo introuvable sur l'API, on ignore l'erreur
          return;
        }
        throw new Error(`Erreur HTTP : ${response.status}`);
      }

      const updatedTodo = await response.json();
      const adaptedTodo = {
        id: updatedTodo.id,
        text: updatedTodo.todo,
        completed: updatedTodo.completed,
        isEditing: false,
        userId: updatedTodo.userId,
      };

      setTodos(prev => prev.map(todo => 
        todo.id === id ? adaptedTodo : todo
      ));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Supprimer une todo
  const deleteTodo = async (id) => {
    try {
      setError(null);
      
      // Si c'est une todo locale (id > 255), on la supprime localement
      if (id > 255) {
        setTodos(prev => prev.filter(todo => todo.id !== id));
        return;
      }

      const response = await fetch(`${BASE_URL}/todos/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        if (response.status === 404) {
          // Todo introuvable sur l'API, on ignore l'erreur
          return;
        }
        throw new Error(`Erreur HTTP : ${response.status}`);
      }

      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return { 
    todos, 
    loading, 
    error, 
    fetchTodos,
    addTodo,
    updateTodo,
    deleteTodo
  };
};
