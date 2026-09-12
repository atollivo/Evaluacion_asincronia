import { API_BASE_URL } from '../utils/config.js';

/**
 * Opción 2: Busca un usuario por su 'username' y obtiene sus datos junto a sus álbumes y fotos.
 * @param {string} username - Nombre de usuario ingresado por consola.
 * @returns {Promise<Object|null>} Objeto estructurado con los datos, álbumes y fotos del usuario.
 */
export async function getUserByUsername(username) {
  try {
    // 1. Filtrar el usuario directamente desde la URL
    const userResponse = await fetch(`${API_BASE_URL}/users?username=${encodeURIComponent(username)}`);

    if (!userResponse.ok) {
      throw new Error('Error al consultar el usuario en la API');
    }

    const users = await userResponse.json();

    // Si el arreglo viene vacío, el usuario no existe
    if (users.length === 0) {
      return null;
    }

    // Tomar el usuario encontrado
    const user = users[0];

    // 2. Consultar simultáneamente los álbumes del usuario y TODAS las fotos
    const [albumsResponse, photosResponse] = await Promise.all([
      fetch(`${API_BASE_URL}/albums?userId=${user.id}`),
      fetch(`${API_BASE_URL}/photos`)
    ]);

    if (!albumsResponse.ok || !photosResponse.ok) {
      throw new Error('Error al obtener álbumes o fotografías');
    }

    const albums = await albumsResponse.json();
    const photos = await photosResponse.json();

    // 3. Agrupar las fotografías por su albumId usando un objeto asociativo (sin .filter)
    const photosByAlbumId = {};
    for (const photo of photos) {
      if (!photosByAlbumId[photo.albumId]) {
        photosByAlbumId[photo.albumId] = [];
      }
      photosByAlbumId[photo.albumId].push({
        id: photo.id,
        title: photo.title,
        url: photo.url,
        thumbnailUrl: photo.thumbnailUrl
      });
    }

    // 4. Estructurar la lista de álbumes con sus fotos (sin .map)
    const structuredAlbums = [];
    for (const album of albums) {
      structuredAlbums.push({
        id: album.id,
        title: album.title,
        photos: photosByAlbumId[album.id] || []
      });
    }

    // 5. Retornar los datos consolidados del usuario
    return {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone,
      website: user.website,
      company: user.company,
      address: user.address,
      albums: structuredAlbums
    };

  } catch (error) {
    console.error('Ocurrió un error al procesar el usuario:', error.message);
    throw error;
  }
}