import { API_BASE_URL } from './utils/config.js';

/**
 * Despliega el menú principal en la consola del sistema.
 */
function showMenu() {
  console.log('\n====================================');
  console.log('         MENÚ DE OPCIONES');
  console.log('====================================');
  console.log('1. Listar tareas pendientes por usuario');
  console.log('2. Salir');
  console.log('====================================');
  
  rl.question('Seleccione una opción: ', async (option) => {
    switch (option.trim()) {
      case '1':
        console.log('\nCargando tareas pendientes desde la API...\n');
        try {
          const data = await getPendingTodosByUser();
          // Imprimir el resultado estructurado en formato JSON legible
          console.log(JSON.stringify(data, null, 2));
        } catch (error) {
          console.log('No se pudo completar la operación.');
        }
        showMenu(); // Volver a mostrar el menú tras finalizar
        break;

      case '2':
        console.log('\nSaliendo de la aplicación...');
        rl.close();
        break;

      default:
        console.log('\nOpción inválida. Intente de nuevo.');
        showMenu();
        break;
    }
  });
}

// Iniciar la aplicación desplegando el menú
showMenu();