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

app.use(express.urlencoded({ extended: true })); // ← necesario para manejar datos de formularios HTML
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.json()); // para JSON
app.use(session({
  secret: 'claveSevero',  // cambia esto por una clave fuerte
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }  // pon `true` solo si usas HTTPS
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.post('/valider_control', (req, res) => {
const id=req.session.utilisateur.id; 
const fecha = new Date();
const id_examen = req.body.examen;
var note = 0;

  const query = 'INSERT INTO control VALUES (null, null, ?, ?, ?)';
  connection.query(query, [fecha, id_examen, id ], (err, result) => {
    if (err) 
      console.error(err);
    
    const queryQ = 'SELECT * FROM question WHERE id_examen = ? ';
    connection.query(queryQ, [ id_examen ], (err, questions) => {
    if (err) 
      console.error(err);

      questions.forEach(question => {

        const queryR = 'SELECT * FROM reponse WHERE id_question = ? ';
        connection.query(queryR, [ question.id ], (err, reponses) => {
          if (err) 
            console.error(err);
          
          if (question.tipe=="Directe") {
            const userResponse = req.body[`reponse${question.id}`].toLowerCase().trim();
            const correctAnswer = reponses[0].reponse.toLowerCase().trim();

            const distance = levenshtein(correctAnswer, userResponse);
            const maxAllowedDistance = Math.floor(correctAnswer.length * 0.1); // 10%

            note += distance <= maxAllowedDistance ? question.taux : 0;
            console.log('La nota es '+ note);
            const correct = distance <= maxAllowedDistance ? "oui" : "non";

            const queryR = 'INSERT INTO reponse_control VALUES (null, ?, ?, ?, ?) ';
            connection.query(queryR, [ userResponse, result.insertId, question.id , correct], (err, resultR) => {
              if (err) 
                console.error(err);
            });
          }else{
            var valido=true;
            reponses.forEach(reponse => {
              const isValida = req.body[`question${question.id}cb{reponse.id}`] !== undefined;
              const rFinal = isValida ? 'correct' : 'incorrect';
              valido = reponse.validite!=rFinal ? false : valido;
              
              const correct = reponse.validite!=rFinal ? "oui" : "non";
              const queryR = 'INSERT INTO reponse_control VALUES (null, ?, ?, ?, ?) ';
              connection.query(queryR, [ reponse.reponse, result.insertId, question.id , correct], (err, resultR) => {
                if (err) 
                  console.error(err);
              });
            });

            note += valido ? question.taux : 0;
            console.log('La nota es '+ note);
          }

          const query = 'UPDATE control SET note = ? WHERE id = ?';
          connection.query(query, [ note, result.insertId ], (err, result) => {
            if (err) 
              console.error(err);
          });

        });
      });
    });

    res.redirect('/resultats/'+ result.insertId);  

  });


});

app.get('/resultats/:id', (req, res) => {
    const id=req.params.id;
    const queryQ = 'SELECT * FROM control WHERE id = ? ';
    connection.query(queryQ, [ id ], (err, result) => {
      if (err) 
        console.error(err);
        const note=result[0].note;
          res.render('resultats', { note });

    });
});

app.get('/', (req, res) => {
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  if (req.session.utilisateur) res.redirect('/profile');  
  res.sendFile(path.join(__dirname, 'views', 'login_register.html'));
});

app.get('/nouveau_examen', (req, res) => {
  if (!req.session.utilisateur || req.session.utilisateur.type!="enseignant") res.redirect('/login');
  res.sendFile(path.join(__dirname, 'views', 'nouveau_examen.html'));
});

app.get('/examen/:id', (req, res) => {
    if (!req.session.utilisateur || req.session.utilisateur.type!="enseignant"){
    return res.redirect('/login');}

  var id = req.params.id;
  var questions = null;

  const query = "SELECT * FROM examen WHERE id= ? ";
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Erreur: problème avec la base de données');
    }
    const examen = results[0];

    // Consulta para obtener las preguntas
    const queryQ = "SELECT * FROM question WHERE id_examen = ? ";
    connection.query(queryQ, [examen.id], (err, resultsQ) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Erreur: problème avec la base de données');
      }

      questions = resultsQ;

      const queryPromises = questions.map((question, i) => {
        return new Promise((resolve, reject) => {
          const queryR = "SELECT * FROM reponse WHERE id_question = ? ";
          connection.query(queryR, [question.id], (err, resultR) => {
            if (err) {
              reject(err);
            }
            questions[i].reponses = resultR; // Añadir las respuestas a la pregunta
            resolve(); // Resolver la Promesa una vez se hayan añadido las respuestas
          });
        });
      });

      // Esperar a que todas las promesas de respuestas se resuelvan
      Promise.all(queryPromises)
        .then(() => {
          // Ahora que todas las respuestas están disponibles, renderizamos la página
          console.log(questions); // Puedes ver las preguntas y respuestas en la consola
          res.render('examen', { examen, questions });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send('Erreur: problème avec les réponses');
        });
    });
  });
});

app.get('/control/:id', (req, res) => {
  if (!req.session.utilisateur || req.session.utilisateur.type!="etudiant") {
  return res.redirect('/login');
}
  var id = req.params.id;
  var questions = null;

  // Consulta para obtener el examen
  const query = "SELECT * FROM examen WHERE id= ? ";
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Erreur: problème avec la base de données');
    }
    const examen = results[0];

    // Consulta para obtener las preguntas
    const queryQ = "SELECT * FROM question WHERE id_examen = ? ";
    connection.query(queryQ, [examen.id], (err, resultsQ) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Erreur: problème avec la base de données');
      }

      questions = resultsQ;

      // Crear un array de Promesas para obtener las respuestas
      const queryPromises = questions.map((question, i) => {
        return new Promise((resolve, reject) => {
          const queryR = "SELECT reponse FROM reponse WHERE id_question = ? ORDER BY rand() ";
          connection.query(queryR, [question.id], (err, resultR) => {
            if (err) {
              reject(err);
            }
            questions[i].reponses = resultR; // Añadir las respuestas a la pregunta
            resolve(); // Resolver la Promesa una vez se hayan añadido las respuestas
          });
        });
      });

      // Esperar a que todas las promesas de respuestas se resuelvan
      Promise.all(queryPromises)
        .then(() => {
          // Ahora que todas las respuestas están disponibles, renderizamos la página
          console.log(questions); // Puedes ver las preguntas y respuestas en la consola
          res.render('control', { examen, questions });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send('Erreur: problème avec les réponses');
        });
    });
  });
});

app.get('/profile', (req, res) => {
  if (!req.session.utilisateur) { 
    return res.redirect('/login');
  }
    const query = "SELECT * FROM " + req.session.utilisateur.type + " WHERE id= ? ";
    connection.query(query, [req.session.utilisateur.id], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Erreur: problème avec la base de données');
      }
      const utilisateur = results[0];
      const tipe = req.session.utilisateur.type;

      if(tipe=="enseignant"){
        const query = "SELECT * FROM examen WHERE id_enseignant= ? ORDER BY id DESC ";
        connection.query(query, [req.session.utilisateur.id], (err, resultsE) => {
          if (err) {
            console.error(err);
            return res.status(500).send('Erreur: problème avec la base de données');
          }
          const examens=resultsE;
          res.render('profile', { utilisateur,  tipe, examens });
        });
        
      }else{
        const query = "SELECT * FROM control WHERE id_etudiant= ? ORDER BY id DESC ";
        connection.query(query, [req.session.utilisateur.id], (err, resultsC) => {
          if (err) {
            console.error(err);
            return res.status(500).send('Erreur: problème avec la base de données');
          }
          const controls=resultsC;
          res.render('profile', { utilisateur,  tipe, controls });
        });
      }
    }); 
});

app.post('/after_login', (req, res) => {
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
    req.session.utilisateur = { id: results[0].id,  type: tabla };
    res.redirect('/profile');
  });
});

app.post('/valider_examen', upload.none(), (req, res) => {
  const numProfe=eq.session.utilisateur.id;
  const { titre, description, cible, numeroq, maxq } = req.body;

  const sql = 'INSERT INTO examen VALUES (null, ?, ?, ?, ?)';
  connection.query(sql, [cible, titre, description, numProfe], (err, result) => {
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
                   });
              }else{
                const maxReponses = parseInt(req.body[`reponses${i}`]);

                for (let k = 1; k <= maxReponses; k++) {
                  const reponse=req.body[`q${i}reponse${k}`];
                  const valid = req.body[`q${i}cb${k}`] ? true : false;
                  const validite= valid ? "correct" : "incorrect";

                  const sqlquestion='INSERT INTO reponse VALUES (null, ?, ?, ' + resultq.insertId + ')';
                  connection.query(sqlquestion, [reponse, validite], (err, resultr) => {
                    if (err) console.error(err);
                   });
                }
              }

            }
          });

        }
      }
      res.redirect("/profile");
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

function levenshtein(a, b) {
  const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      const cost = a[j - 1] === b[i - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[b.length][a.length];
}


app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
