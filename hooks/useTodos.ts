// hooks/useTodos.ts

import { useState, useEffect } from 'react';
import { getTodos, createTodo, updateTodo, toggleTodo, deleteTodo } from '@/lib/api/todos';
import { Todo, CreateTodoDTO, UpdateTodoDTO } from '@/types/todo';
import toast from 'react-hot-toast';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch todos on mount
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      const data = await getTodos();
      console.log('📋 Fetched todos:', data);
      // Ensure data is an array
      if (Array.isArray(data)) {
        setTodos(data);
      } else {
        console.error('❌ Todos response is not an array:', data);
        setTodos([]);
      }
    } catch (error: any) {
      console.error('Failed to fetch todos:', error);
      setTodos([]); // Set empty array on error
      toast.error('Failed to load todos');
    } finally {
      setIsLoading(false);
    }
  };

  const refresh = async () => {
    try {
      setIsRefreshing(true);
      const data = await getTodos();
      setTodos(data);
    } catch (error: any) {
      toast.error('Failed to refresh todos');
    } finally {
      setIsRefreshing(false);
    }
  };

  const addTodo = async (data: CreateTodoDTO) => {
    try {
      const newTodo = await createTodo(data);
      setTodos((prev) => [newTodo, ...prev]);
      toast.success('Todo created successfully!');
      return newTodo;
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Failed to create todo';
      toast.error(message);
      throw error;
    }
  };

  const updateTodoById = async (id: number, data: UpdateTodoDTO) => {
    try {
      const updatedTodo = await updateTodo(id, data);
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? updatedTodo : todo))
      );
      toast.success('Todo updated successfully!');
      return updatedTodo;
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Failed to update todo';
      toast.error(message);
      throw error;
    }
  };

  const toggleTodoById = async (id: number, isCompleted: boolean) => {
    try {
      const updatedTodo = await toggleTodo(id, isCompleted);
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? updatedTodo : todo))
      );
      toast.success(isCompleted ? 'Todo completed! 🎉' : 'Todo reopened');
      return updatedTodo;
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Failed to toggle todo';
      toast.error(message);
      throw error;
    }
  };

  const deleteTodoById = async (id: number) => {
    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
      toast.success('Todo deleted');
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Failed to delete todo';
      toast.error(message);
      throw error;
    }
  };

  // Computed values (with safety checks)
  const totalTodos = Array.isArray(todos) ? todos.length : 0;
  const completedTodos = Array.isArray(todos) ? todos.filter((todo) => todo.is_completed).length : 0;
  const pendingTodos = Array.isArray(todos) ? todos.filter((todo) => !todo.is_completed).length : 0;

  return {
    todos,
    isLoading,
    isRefreshing,
    totalTodos,
    completedTodos,
    pendingTodos,
    fetchTodos,
    refresh,
    addTodo,
    updateTodo: updateTodoById,
    toggleTodo: toggleTodoById,
    deleteTodo: deleteTodoById,
  };
}
