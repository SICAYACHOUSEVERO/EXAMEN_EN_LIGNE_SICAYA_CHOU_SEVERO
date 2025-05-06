const express = require('express');
const app = express();
const PORT = 3000;
const connection = require('./db'); // Importamos la conexión de db.js
const path = require('path');
const bodyParser = require('body-parser');
app.use(express.urlencoded({ extended: true })); // ← necesario para manejar datos de formularios HTML


app.use(bodyParser.json());
app.use(express.static('public'));
//app.use(express.static(path.join(__dirname, 'public')));


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login_register.html'));
});
app.get('/nouveau_examen', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'examen.html'));
});

app.post('/profile', (req, res) => {
  const { email_login, password_login, tipe_login } = req.body;

  const isEnseignant = req.body.tipe_login !== undefined; // Si el checkbox está marcado
  var tabla= isEnseignant ? 'enseignant' : 'etudiant'

  const query = "SELECT * FROM "+tabla+" WHERE mail = ? AND mot_de_passe = md5(?) ";
  connection.query(query, [email_login, password_login], (err, results) => {

    if (err) {
      console.error(err);
      return res.status(500).send('Erreur: problème avec la base de données');
    }

    if (results.length === 0) {
      return res.status(401).send('Utilisateur non trouvé ou mot de passe incorrect');
    }

      const utilisateur = results[0];

    res.render('profile', { utilisateur });
  });
});

app.post('/inserer_utilisateur', (req, res) => {
  const { nom, prenom, email, password, ddns, sexe, etablissement, filiere, tipe } = req.body;

  var tabla= 'etudiant';
    const suisProfe = req.body.tipe ? true : false;  // 'terms' is the checkbox name
  if(suisProfe == true){
    tabla= 'enseignant';
  }

  const query = 'INSERT INTO '+tabla+' VALUES (null, ?, ?, ?, ?, ?, ?, ?, ?)';
  connection.query(query, [nom, prenom, email, password, ddns, sexe, etablissement, filiere], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al insertar' });
    }
    res.json({ message: 'Insertado con éxito' });
  });

});

// Ruta para hacer la consulta a la tabla 'enseignant'
app.get('/enseignants', (req, res) => {
  const sql = 'SELECT * FROM enseignant'; // Consulta SQL para obtener todos los registros

  connection.query(sql, (err, results) => {
    if (err) 
      return res.status(500).send('Error al obtener los datos');
    res.render('enseignants', { enseignants: results });
  });

});

//app.get('/', (req, res) => {
//res.send('¡Hola Mundo desde Express!');
//});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
