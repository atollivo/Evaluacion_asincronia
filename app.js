import readline from 'node:readline';
import { getPendingTodosByUser , getUserByUsername} from './src/ejercicios/index.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Despliega el menú principal en la consola del sistema.
 */
function showMenu() {
  console.log('\n====================================');
  console.log('         MENÚ DE OPCIONES');
  console.log('====================================');
  console.log('1. Listar tareas pendientes por usuario');
  console.log('2. Buscar usuario por nombre');
  console.log('3. Salir');
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
        rl.question('Ingrese el nombre de usuario: ', async (username) => {
          try {
            const user = await getUserByUsername(username);
            if (user) {
              console.log(JSON.stringify(user, null, 2));
            } else {
              console.log('Usuario no encontrado.');
            }
          } catch (error) {
            console.log('No se pudo completar la operación.');
          }
          showMenu();
        });
        break;

      case '3':
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