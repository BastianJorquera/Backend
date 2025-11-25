require('dotenv').config();
const { Pool } = require('pg');
const axios = require('axios');

// 1. Configuración de la Base de Datos
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.PORT,
  ssl: {
    rejectUnauthorized: false 
  }
});

// ID de la franquicia Pokémon en tu BD (Cámbialo por el ID real que tengas en tu tabla Franquicia)
const ID_FRANQUICIA_POKEMON = 1; 

// URL de la API
const API_URL = 'https://api.pokemontcg.io/v2/cards';

async function sincronizarCartas() {
  console.log('🚀 Iniciando sincronización...');
  const client = await pool.connect();

  try {
    // 2. Pedir datos a la API externa
    // NOTA: Para prueba pedimos solo el "Base Set" (id: base1) para no traer 15.000 cartas de golpe.
    // En el futuro puedes quitar el filtro 'q' para traer todo (necesitarás paginación).
    const response = await axios.get(API_URL, {
      params: { q: 'set.id:basep' },  //puedes cambiar "base1" por cualquier otra
      headers: { 'X-Api-Key': process.env.POKEMON_API_KEY || '' }
    });

    const cartasAPI = response.data.data;
    console.log(`🃏 Se encontraron ${cartasAPI.length} cartas en la API.`);

    // Iniciamos una transacción SQL (si algo falla, no se guarda nada a medias)
    await client.query('BEGIN');

    for (const carta of cartasAPI) {
      // 3. Mapeo de datos (API -> Tu BD)
      const nombre = carta.name;
      const rareza = carta.rarity || 'Desconocida'; // A veces viene null
      // La API da tipos en Array ['Fire'], tu BD espera string. Lo convertimos.
      const tipo = carta.types ? carta.types.join(', ') : 'N/A'; 
      const imagen = carta.images.large || carta.images.small;
      const idApi = carta.id;
      const nombreSet = carta.set.name;
      const numero = carta.number;

      // 4. Query de Inserción
      // Usamos "ON CONFLICT DO NOTHING" para que si corres el script 2 veces, 
      // no te de error por duplicados.
      const query = `
        INSERT INTO public."Carta" 
        (nombre, rareza, tipo, id_franquicia, imagen_carta, id_api_externa, nombre_set, numero_carta)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (id_api_externa) DO NOTHING
      `;

      const values = [
        nombre, 
        rareza, 
        tipo, 
        ID_FRANQUICIA_POKEMON, 
        imagen, 
        idApi, 
        nombreSet, 
        numero
      ];

      await client.query(query, values);
    }

    await client.query('COMMIT');
    console.log('✅ Sincronización completada con éxito.');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error en la sincronización:', error.message);
  } finally {
    client.release();
    pool.end(); // Cerramos la conexión
  }
}

// Ejecutar la función
sincronizarCartas();