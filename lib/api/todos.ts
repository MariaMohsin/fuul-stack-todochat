// lib/api/todos.ts

import apiClient from './client';
import { Todo, CreateTodoDTO, UpdateTodoDTO } from '@/types/todo';

/**
 * Get all todos for the authenticated user
 */
export async function getTodos(): Promise<Todo[]> {
  const response = await apiClient.get<{ todos: Todo[]; total: number }>('/todos/');
  // Backend returns {todos: [...], total: number}
  return response.data.todos;
}

/**
 * Create a new todo
 */
export async function createTodo(data: CreateTodoDTO): Promise<Todo> {
  const response = await apiClient.post<Todo>('/todos/', data);
  return response.data;
}

/**
 * Update an existing todo
 */
export async function updateTodo(id: number, data: UpdateTodoDTO): Promise<Todo> {
  const response = await apiClient.put<Todo>(`/todos/${id}/`, data);
  return response.data;
}

/**
 * Toggle todo completion status
 */
export async function toggleTodo(id: number, isCompleted: boolean): Promise<Todo> {
  const response = await apiClient.patch<Todo>(`/todos/${id}/`, {
    is_completed: isCompleted
  });
  return response.data;
}

/**
 * Delete a todo
 */
export async function deleteTodo(id: number): Promise<void> {
  await apiClient.delete(`/todos/${id}/`);
}
