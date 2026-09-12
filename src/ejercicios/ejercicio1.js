import { API_BASE_URL } from './utils/config.js';

**
 * Opción 1: Obtiene los usuarios y sus tareas pendientes organizadas por usuario.
 * @returns {Promise<Array<Object>>} Lista de usuarios con sus tareas sin completar (completed === false).
 */
export async function getPendingTodosByUser() {
  try {
    // 1. Realizar peticiones HTTP en paralelo para optimizar la carga de datos
    const [usersResponse, todosResponse] = await Promise.all([
      fetch(`${API_BASE_URL}/users`),
      fetch(`${API_BASE_URL}/todos`)
    ]);

    // Verificar si las respuestas de la API fueron exitosas (código 200-299)
    if (!usersResponse.ok || !todosResponse.ok) {
      throw new Error('Error en la respuesta de la API');
    }

    // Convertir las respuestas de la API a formato JSON
    const users = await usersResponse.json();
    const todos = await todosResponse.json();

    // 2. Filtrar y agrupar las tareas pendientes por cada usuario
    const result = users.map(user => {
      // Obtener solo las tareas del usuario actual que NO estén completadas
      const pendingTodos = todos.filter(
        todo => todo.userId === user.id && !todo.completed
      );

      // Retornar un objeto estructurado con la información formateada
      return {
        userId: user.id,
        userName: user.name,
        totalPending: pendingTodos.length,
        pendingTodos: pendingTodos.map(todo => ({
          id: todo.id,
          title: todo.title
        }))
      };
    });

    return result;

  } catch (error) {
    // Captura de errores en caso de fallo de red o parseo de datos
    console.error('Ocurrió un error al procesar la solicitud:', error.message);
    throw error;
  }
}