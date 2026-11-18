import morgan from 'morgan';
import chalk from 'chalk';

/**
 * Token personalizado de Morgan que colorea el código de estado de una respuesta HTTP.
 *
 * Convenciones utilizadas:
 * - 2xx: verde, solicitudes exitosas.
 * - 3xx: cian, redirecciones.
 * - 4xx: amarillo, errores del cliente.
 * - 5xx: rojo, errores del servidor.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {string} Estado HTTP coloreado.
 */

morgan.token('colored-status', (req, res) => {
  const status = res.statusCode;

  if (status >= 500) {
    return chalk.red.bold(status);
  }

  if (status >= 400) {
    return chalk.yellow.bold(status);
  }

  if (status >= 300) {
    return chalk.cyan(status);
  }

  return chalk.green(status);
});

/**
 * Token personalizado que identifica visualmente el método HTTP utilizado en cada solicitud.
 *
 * @param {import('express').Request} req
 * @returns {string} Método HTTP coloreado.
 */

morgan.token('colored-method', (req) => {
  const method = req.method;

  const colors = {
    GET: chalk.blue,
    POST: chalk.green,
    PUT: chalk.yellow,
    PATCH: chalk.magenta,
    DELETE: chalk.red,
  };

  return (colors[method] || chalk.white)(method);
});

/**
 * Middleware de registro de solicitudes HTTP.
 *
 * Registra:
 * - Fecha y hora de la solicitud.
 * - Método HTTP.
 * - Ruta solicitada.
 * - Código de respuesta.
 * - Tiempo de respuesta en milisegundos.
 *
 * El registro se desactiva durante las pruebas automatizadas para evitar ruido en la consola.
 *
 * @type {import('express').RequestHandler}
 */

export const httpLogger = morgan(
  ':date[iso] :colored-method :url :colored-status :response-time ms',
  { skip: () => process.env.NODE_ENV === 'test', }
);