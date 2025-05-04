const mysql = require('mysql2');

// Crea la conexión con la base de datos
const connection = mysql.createConnection({
  host: 'localhost',       // Usualmente 'localhost' si phpMyAdmin está en tu máquina local
  user: 'root',            // El nombre de usuario de tu base de datos
  password: '',            // La contraseña de tu base de datos (deja vacío si no tienes contraseña)
  database: 'examen_enligne'  // El nombre de tu base de datos
});

// Verifica la conexión
connection.connect((err) => {
  if (err) {
    console.error('Error de conexión: ' + err.stack);
    return;
  }
  console.log('Conectado a la base de datos como id ' + connection.threadId);
});

module.exports = connection; // Exportamos la conexión para usarla en otros archivos
