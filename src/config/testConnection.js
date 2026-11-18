import { pool } from './db.js';

/**
 * Comprueba la conexión del backend con PostgreSQL.
 *
 * Ejecuta una consulta de prueba para obtener
 * el nombre de la base de datos, el usuario conectado
 * y la fecha actual del servidor.
 *
 * En caso de error, establece un código de salida
 * distinto de cero para indicar que la prueba falló.
 *
 * @async
 * @returns {Promise<void>}
 */

async function testConnection() {
  try {
    const result = await pool.query(`SELECT current_database(), current_user, NOW()`);

    console.log('Conexión exitosa a PostgreSQL');
    console.table(result.rows);
  } catch (error) {
    console.error('Error de conexión:', error.message);
    process.exitCode = 1;
  } finally {
    // Cierra el pool al finalizar la prueba.
    await pool.end();
  }
}

testConnection();