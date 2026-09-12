import { API_BASE_URL } from '../utils/config.js';

/**
 * Opción 1: Obtiene las tareas pendientes solicitando el filtro directamente en la URL.
 * @returns {Promise<Array<Object>>} Lista de usuarios con sus tareas pendientes agrupadas.
 */
export async function getPendingTodosByUser() {
  try {
    // 1. Filtrar directo en la URL mediante el query param: ?completed=false
    const [usersResponse, todosResponse] = await Promise.all([
      fetch(`${API_BASE_URL}/users`),
      fetch(`${API_BASE_URL}/todos?completed=false`)
    ]);

    // Validar el estado de las peticiones
    if (!usersResponse.ok || !todosResponse.ok) {
      throw new Error('Error en la respuesta de la API');
    }

    const users = await usersResponse.json();
    const pendingTodos = await todosResponse.json();

    // 2. Agrupar las tareas directamente por userId usando un objeto acumulador
    const todosByUserId = {};
    for (const todo of pendingTodos) {
      if (!todosByUserId[todo.userId]) {
        todosByUserId[todo.userId] = [];
      }
      todosByUserId[todo.userId].push({
        id: todo.id,
        title: todo.title
      });
    }

    // 3. Construir la estructura final recorriendo la lista de usuarios con for...of
    const result = [];
    for (const user of users) {
      const userTasks = todosByUserId[user.id] || [];
      
      result.push({
        userId: user.id,
        userName: user.name,
        totalPending: userTasks.length,
        pendingTodos: userTasks
      });
    }

    return result;

  } catch (error) {
    console.error('Ocurrió un error al procesar la solicitud:', error.message);
    throw error;
  }
}