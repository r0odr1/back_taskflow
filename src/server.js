import 'dotenv/config';
import chalk from 'chalk';
import app from './app.js';

// Puerto de ejecución del servidor HTTP.
const PORT = process.env.PORT || 4000;

//Inicia el servidor HTTP de TaskFlow
app.listen(PORT, () => {
  console.log(chalk.cyan.bold('\n========================================'));
  console.log(chalk.blue.bold('              TASKFLOW API'));
  console.log(chalk.cyan.bold('========================================'));

  // Dirección principal del backend.
  console.log(chalk.green('✔ Servidor: ') + chalk.white(`http://localhost:${PORT}`));

  // Dirección de la documentación Swagger.
  console.log(chalk.blue('✔ Swagger:  ') + chalk.white(`http://localhost:${PORT}/api/docs`));

  // Entorno configurado para la aplicación.
  console.log(chalk.yellow('✔ Entorno:  ') + chalk.white(process.env.NODE_ENV || 'development'));

  console.log(chalk.cyan('========================================\n'));
});