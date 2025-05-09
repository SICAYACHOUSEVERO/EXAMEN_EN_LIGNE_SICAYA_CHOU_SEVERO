const express = require('express');
const app = express();
const PORT = 3000;
const connection = require('./db'); // Importamos la conexión de db.js
const path = require('path');
const bodyParser = require('body-parser');

const multer = require('multer');
const storage = multer.memoryStorage(); // o usar diskStorage para guardar archivos
const upload = multer({ storage: storage });

const session = require('express-session');

app.use(session({
  secret: 'claveSevero',  // cambia esto por una clave fuerte
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }  // pon `true` solo si usas HTTPS
}));


app.use(express.urlencoded({ extended: true })); // ← necesario para manejar datos de formularios HTML
app.use(bodyParser.json());
app.use(express.static('public'));
//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // para JSON

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login_register.html'));
});

app.get('/login', (req, res) => {
    if (req.session.utilisateur) {
       res.redirect('/profile');  
    }
  res.sendFile(path.join(__dirname, 'views', 'login_register.html'));
});
app.get('/nouveau_examen', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'examen.html'));
});

app.get('/profile', (req, res) => {
  if (req.session.utilisateur) {
    const query = "SELECT * FROM " + req.session.utilisateur.type + " WHERE id= ? ";
    connection.query(query, [req.session.utilisateur.id], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Erreur: problème avec la base de données');
      }
      const utilisateur = results[0];
      res.render('profile', { utilisateur });
    });
  } 
  else {
 
    const { email_login, password_login, tipe_login } = req.body;
    const isEnseignant = tipe_login !== undefined;
    const tabla = isEnseignant ? 'enseignant' : 'etudiant';

    const query = "SELECT * FROM " + tabla + " WHERE mail = ? AND mot_de_passe = md5(?) ";
    connection.query(query, [email_login, password_login], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Erreur: problème avec la base de données');
      }
      if (results.length === 0) {
        return res.status(401).send('Utilisateur non trouvé ou mot de passe incorrect');
      }


      const utilisateur = results[0];
      req.session.utilisateur = {id: utilisateur.id,  type: tabla };

      res.render('profile', { utilisateur });
    });
  }
});



app.post('/valider_examen', upload.none(), (req, res) => {



  const { titre, description, cible, numeroq, maxq } = req.body;
  const numProfe=1; //a definir a traves de la sesion //restriccion a los usuarios

  const sql = 'INSERT INTO examen VALUES (null, ?, ?, ?, 1)';
  connection.query(sql, [titre, description, cible], (err, result) => {
    if (err) console.error(err);
    else{

      var numeroqq=parseInt(numeroq);
      var maxqq=parseInt(maxq);
      for (let i = 1; i <= maxqq; i++) {
        const question = req.body[`question${i}`];
        if(question){
          const [tipe, ennonce, cible, fichier, t_fichier, taux, duree] = 
          ['tipe', 'ennonce', 'cible', 'fichier', 't_fichier', 'taux', 'duree'].map(key => req.body[`${key}${i}`]);
          const sqlquestion='INSERT INTO question VALUES (null, ?, ?, ?, ?, ?, ?, ' + result.insertId + ')';

          connection.query(sqlquestion, [tipe, ennonce, "Ruta", t_fichier, taux, duree], (err, resultq) => {
            if (err) console.error(err);
            else{
              if(tipe=="Directe"){
                  const reponse = req.body[`reponse${i}`];
                  const sqlquestion="INSERT INTO reponse VALUES (null, ?, 'correct', " + resultq.insertId + ')';

                  connection.query(sqlquestion, [ reponse ], (err, resultr) => {
                    if (err) console.error(err);
                    else console.log("Respuesta insertada con exito #"+ resultr.insertId); });

              }else{
                const maxReponses = parseInt(req.body[`reponses${i}`]);

                for (let k = 1; k <= maxReponses; k++) {
                  const reponse=req.body[`q${i}reponse${k}`];
                  const valid = req.body[`q${i}cb${k}`] ? true : false;
                  const validite= valid ? "correct" : "incorrect";

                  const sqlquestion='INSERT INTO reponse VALUES (null, ?, ?, ' + resultq.insertId + ')';
                  connection.query(sqlquestion, [reponse, validite], (err, resultr) => {
                    if (err) console.error(err);
                    else console.log("Respuesta insertada con exito #"+ resultr.insertId); });
                }
              }

                console.log("Pregunta insertada con exito #"+ resultq.insertId);
            }
          });

        }
      }

      res.send("examen insertado con exito con id = "+result.insertId);
      }
  });


  /*const { email_login, password_login, tipe_login } = req.body;

  const isEnseignant = req.body.tipe_login !== undefined;  Si el checkbox está marcado
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
  });*/
});



app.post('/inserer_utilisateur', (req, res) => {
  const { nom, prenom, email, password, ddns, sexe, etablissement, filiere, tipe } = req.body;

  var tabla= 'etudiant';
    const suisProfe = req.body.tipe ? true : false;  // 'terms' is the checkbox name
  if(suisProfe == true){
    tabla= 'enseignant';
  }

  const query = 'INSERT INTO '+tabla+' VALUES (null, ?, ?, ?,md5(?), ?, ?, ?, ?)';
  connection.query(query, [nom, prenom, email, password, ddns, sexe, etablissement, filiere], (err, result) => {
    if (err) 
      console.error(err);
    else {
      req.session.utilisateur = {id:result.insertId,  type: tabla };

       res.redirect('/profile');  
    }

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
