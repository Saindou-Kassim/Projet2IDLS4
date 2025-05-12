// Importation des modules nécessaires
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const Examens = require('./models/Examens'); // Assure-toi que ce modèle existe
const Question = require('./models/Question'); // Assure-toi que ce modèle existe

// Configuration de l'application Express
const app = express();
const port = 3000;

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/examens_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => {
    console.error('Erreur de connexion à MongoDB :', err);
    process.exit(1); // Arrête le serveur si la connexion échoue
  });

// Middleware pour autoriser les requêtes CORS
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware pour servir des fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuration de Multer pour l'upload de fichiers
const upload = multer({
  dest: 'uploads/', // Dossier de destination pour les fichiers uploadés
  limits: { fileSize: 5 * 1024 * 1024 }, // Limite de taille des fichiers (5 MB max)
});

// Middleware pour valider les données des requêtes
function validateQuestionData(req, res, next) {
  const { type, examenId, question, reponses, reponseCorrecte, reponseAttendue, tolerance } = req.body;

  if (!type || !examenId || !question) {
    return res.status(400).json({ message: 'Données manquantes : type, examenId ou question' });
  }

  if (type === 'qcm' && (!reponses || !reponseCorrecte)) {
    return res.status(400).json({ message: 'Les réponses et la bonne réponse sont requises pour un QCM' });
  }

  if (type === 'libre' && (!reponseAttendue || !tolerance)) {
    return res.status(400).json({ message: 'La réponse attendue et la tolérance sont requises pour une question libre' });
  }

  next();
}

// Route par défaut pour servir l'interface HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'ajout_questions.html'));
});

// Route pour créer une question
app.post('/api/questions', upload.single('file'), validateQuestionData, async (req, res) => {
  try {
    const { type, examenId, question, reponses, reponseCorrecte, reponseAttendue, tolerance } = req.body;

    const newQuestion = new Question({
      type,
      examenId,
      question,
      reponses: type === 'qcm' ? JSON.parse(reponses) : undefined,
      reponseCorrecte: type === 'qcm' ? JSON.parse(reponseCorrecte) : undefined,
      reponseAttendue: type === 'libre' ? reponseAttendue : undefined,
      tolerance: type === 'libre' ? tolerance : undefined,
      fichier: req.file ? req.file.path : undefined,
      note,
      duree,
    });

    await newQuestion.save();
    res.status(201).json({ message: 'Question créée avec succès', question: newQuestion });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la création de la question', error: err.message });
  }
});







app.post('/questions', upload.single('file'), async (req, res) => {
  try {
    const {
      type,
      examenId,
      question,
      note,
      duree,
      reponses,
      reponsesCorrecte,
      reponseAttendue,
      tolerance
    } = req.body;

    if (!type || !examenId || !question || !note || !duree) {
      return res.status(400).json({ message: "Champs requis manquants." });
    }

    const newQuestion = new Question({
      type,
      examenId,
      question,
      note,
      duree,
      fichier: req.file ? req.file.path : undefined,
    });

    if (type === 'qcm') {

      
      if (!reponses || !reponsesCorrecte) {
        return res.status(400).json({ message: "Champs QCM requis manquants." });
      }

      newQuestion.reponses = JSON.parse(reponses);
      newQuestion.reponseCorrecte = JSON.parse(reponsesCorrecte);

    } else if (type === 'directe') {
      if (!reponseAttendue || !tolerance) {
        return res.status(400).json({ message: "Champs de réponse directe manquants." });
      }

      newQuestion.reponseAttendue = reponseAttendue;
      newQuestion.tolerance = tolerance;
    }

    await newQuestion.save();
    res.status(201).json({ message: "Question ajoutée avec succès !" });
  } catch (error) {
    console.error("Erreur serveur:", error);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
});



/*app.post('/questions', async (req, res) => {
    try {
        const { type, examenId, question, reponseAttendue, tolerance, note, duree } = req.body;

        // Validation des champs requis
        if (!type || !examenId || !question || !reponseAttendue || !tolerance || !note || !duree) {
            return res.status(400).json({ message: "Tous les champs sont requis." });
        }

        // Création de la question
        const newQuestion = new Question({
            type,
            examenId,
            question,
            reponseAttendue,
            tolerance,
            note,
            duree,
        });

        await newQuestion.save();
        res.status(201).json({ message: "Question ajoutée avec succès !" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur interne du serveur." });
    }
});*/




// Route pour ajouter une question sans fichier
app.post('/ajouter-question', async (req, res) => {
  try {
    const { type, question, note, duree, reponse, tolerance } = req.body;
    const examId = req.body.examId;

    if (!type || !question || !examId) {
      return res.status(400).json('Données manquantes');
    }

    let nouvelleQuestion;

    if (type === 'qcm') {
      const options = [];
      const reponses = [];

      for (let i = 1; req.body[`option${i}`]; i++) {
        options.push(req.body[`option${i}`]);
      }

      for (let i = 1; req.body[`reponse${i}`]; i++) {
        reponses.push(req.body[`reponse${i}`]);
      }

      if (options.length === 0 || reponses.length === 0 || !note || !duree) {
        return res.status(400).json('Données QCM manquantes');
      }

      nouvelleQuestion = new Question({
        examId,
        type,
        question,
        options,
        reponses,
        note,
        duree
      });

    } else if (type === 'directe') {
      if (!reponse || !tolerance) {
        return res.status(400).json('Données question directe manquantes');
      }

      nouvelleQuestion = new Question({
        examId,
        type,
        question,
        reponse,
        tolerance
      });
    } else {
      return res.status(400).json('Type de question inconnu');
    }

    await nouvelleQuestion.save();
    console.log('Question ajoutée avec succès');
    res.status(201).json('Question ajoutée avec succès');
  } catch (error) {
    console.error('Erreur serveur:', error);
    res.status(500).json('Erreur serveur');
  }
});

// Route pour créer un examen
app.post('/examens', async (req, res) => {
  try {
    const { titre, description, public } = req.body;

    if (!titre || !description || !public) {
      return res.status(400).json({ message: "Tous les champs sont requis pour créer un examen" });
    }

    const nouvelExamen = new Examens({
      titre,
      description,
      public,
      date: new Date()
    });

    await nouvelExamen.save();
    res.status(201).json({ message: 'Examen créé avec succès', examen: nouvelExamen });
  } catch (err) {
    console.error('Erreur lors de la création de l\'examen :', err);
    res.status(500).json({ message: 'Erreur lors de l\'enregistrement' });
  }
});

// Récupérer tous les examens
app.get('/examens', async (req, res) => {
  try {
    const examens = await Examens.find();
    res.json(examens);
  } catch (error) {
    console.error('Erreur lors de la récupération des examens:', error);
    res.status(500).json('Erreur serveur');
  }
});

// Route pour mettre à jour un examen
app.put('/examens/:id', async (req, res) => {
  try {
    const updated = await Examens.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Examen non trouvé' });
    res.json({ message: 'Examen mis à jour avec succès', examen: updated });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Supprimer une question
app.delete('/questions/:id', async (req, res) => {
  const questionId = req.params.id;

  try {
    const deletedQuestion = await Question.findByIdAndDelete(questionId);
    if (!deletedQuestion) {
      return res.status(404).json({ message: "Question non trouvée" });
    }
    res.json({ message: "Question supprimée avec succès" });
  } catch (error) {
    console.error('Erreur lors de la suppression :', error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ error: 'Page non trouvée' });
});

// Démarrage du serveur
/*app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});*/

// Lancer le serveur
app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
});







/*const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const multer = require('multer'); // Assurez-vous que multer est installé

const Examens = require('./models/Examens');

// const bodyParser = require('body-parser');
const Question = require('./models/Question');
//const Question = require('./models/Question');

const app = express();
const port = 3000;

// Configuration de MongoDB
mongoose.connect('mongodb://localhost:27017/examens_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('connecté à MongoDB'))
.catch(err => console.error('Erreur de connexion à MongoDB :', err));

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Configuration de Multer pour l'upload de fichiers
const upload = multer({ 
    dest: 'uploads/',
    limits: { fileSize: 5 * 1024 * 1024 } // Limite de taille des fichiers (5 MB max)
});

// Middleware pour valider les données des requêtes
function validateQuestionData(req, res, next) {
    const { type, examenId, question, reponses, reponseCorrecte, reponseAttendue, tolerance } = req.body;

    if (!type || !examenId || !question) {
        return res.status(400).json({ message: "Données manquantes : type, examenId ou question" });
    }

    if (type === 'qcm' && (!reponses || !reponseCorrecte)) {
        return res.status(400).json({ message: "Les réponses et la bonne réponse sont requises pour un QCM" });
    }

    if (type === 'libre' && (!reponseAttendue || !tolerance)) {
        return res.status(400).json({ message: "La réponse attendue et la tolérance sont requises pour une question libre" });
    }

    next();
}

// Route pour enregistrer une question avec gestion de fichier
app.post('/examens/:examenId/questions', upload.single('file'), validateQuestionData, async (req, res) => {
    const { examenId } = req.params;
    const { type, question, reponses, reponseCorrecte, reponseAttendue, tolerance } = req.body;
    const file = req.file;

    let nouvelleQuestion;
    try {
        if (type === 'qcm') {
            const bonneReponse = Array.isArray(reponseCorrecte) ? reponseCorrecte : [reponseCorrecte];
            nouvelleQuestion = new Question({
                type: 'qcm',
                examenId,
                question,
                reponses,
                reponseCorrecte: bonneReponse,
                file: file ? file.path : null
            });
        } else if (type === 'libre') {
            nouvelleQuestion = new Question({
                type: 'libre',
                examenId,
                question,
                reponseAttendue,
                tolerance,
                file: file ? file.path : null
            });
        }

        const savedQuestion = await nouvelleQuestion.save();
        res.status(201).json(savedQuestion);
    } catch (err) {
        console.error('Erreur lors de l’ajout de la question :', err);
        res.status(500).json({ message: 'Erreur lors de l’ajout de la question', error: err.message });
    }
});

app.post('/ajouter-question', async (req, res) => {
  try {
    const { type, question, note, duree, reponse, tolerance } = req.body;
    const examId = req.body.examId;

    if (!type || !question || !examId) {
      return res.status(400).json('Données manquantes');
    }

    let nouvelleQuestion;

    if (type === 'qcm') {
      const options = [];
      const reponses = [];

      for (let i = 1; req.body[`option${i}`]; i++) {
        options.push(req.body[`option${i}`]);
      }

      for (let i = 1; req.body[`reponse${i}`]; i++) {
        reponses.push(req.body[`reponse${i}`]);
      }

      if (options.length === 0 || reponses.length === 0 || !note || !duree) {
        return res.status(400).json('Données QCM manquantes');
      }

      nouvelleQuestion = new Question({
        examId,
        type,
        question,
        options,
        reponses,
        note,
        duree
      });

    } else if (type === 'directe') {
      if (!reponse || !tolerance) {
        return res.status(400).json('Données question directe manquantes');
      }

      nouvelleQuestion = new Question({
        examId,
        type,
        question,
        reponse,
        tolerance
      });
    } else {
      return res.status(400).json('Type de question inconnu');
    }

    await nouvelleQuestion.save();
    console.log('Question ajoutée avec succès');
    res.status(200).json('Question ajoutée avec succès');
  } catch (error) {
    console.error('Erreur serveur:', error);
    res.status(500).json('Erreur serveur');
  }
});





// Route pour créer un examen
app.post('/examens', async (req, res) => {
    try {
        const { titre, description, public } = req.body;

        if (!titre || !description || !public) {
            return res.status(400).json({ message: "Tous les champs sont requis pour créer un examen" });
        }

        const nouvelExamen = new Examens({
            titre,
            description,
            public,
            date: new Date()
        });

        await nouvelExamen.save();
        res.status(201).json({ message: 'Examen créé avec succès', examen: nouvelExamen });
    } catch (err) {
        console.error('Erreur lors de la création de l\'examen :', err);
        res.status(500).json({ message: 'Erreur lors de l\'enregistrement' });
    }
});

// Récupérer tous les examens
app.get('/examens', async (req, res) => {
    try {
        const examens = await Examens.find();
        res.json(examens);
    } catch (error) {
        console.error('Erreur lors de la récupération des examens:', error);
        res.status(500).json('Erreur serveur');
    }
});

// Route pour mettre à jour un examen
app.put('/examens/:id', async (req, res) => {
    try {
        const updated = await Examens.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: 'Examen non trouvé' });
        res.json({ message: 'Examen mis à jour avec succès', examen: updated });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Supprimer une question
app.delete('/questions/:id', async (req, res) => {
    const questionId = req.params.id;

    try {
        const deletedQuestion = await Question.findByIdAndDelete(questionId);
        if (!deletedQuestion) {
            return res.status(404).json({ message: "Question non trouvée" });
        }
        res.json({ message: "Question supprimée avec succès" });
    } catch (error) {
        console.error('Erreur lors de la suppression :', error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// Gestion des erreurs 404
app.use((req, res) => {
    res.status(404).json({ error: 'Page non trouvée' });
});

// Démarrage du serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});*/



/*app.post('/ajouter-question', async (req, res) => {
    try {
        // Déstructuration des données envoyées par le client
        const { type, question, note, duree, reponse, tolerance, option1, option2, option3, reponse1 } = req.body;

        if (!type || !question) {
            return res.status(400).json({ message: 'Données manquantes : type ou question' });
        }

        if (type === 'qcm') {
            // Pour les questions QCM, assure-toi que toutes les options et réponses sont envoyées
           
            if (!option1 || !option2 || !option3 || !reponse1) {
                return res.status(400).json({ message: 'Données manquantes pour les options de QCM' });
            }

            // Enregistrer la question QCM dans la base de données (MongoDB, par exemple)
            // Ajoute le traitement pour enregistrer la question dans ta DB
            // Exemple :
           

            const nouvelleQuestion = new Question({
                type,
                question,
                options: type === 'qcm' ? options : undefined,
                bonnesReponses: type === 'qcm' ? reponses : undefined,
                reponse: type === 'directe' ? reponse : undefined,
                tolerance: type === 'directe' ? tolerance : undefined,
                note: note ? parseFloat(note) : undefined,
                duree: duree ? parseInt(duree) : undefined,
                file: filePath || null,
                examId
            });


            await newQuestion.save();
            return res.status(200).json({ message: 'Question ajoutée avec succès', data: newQuestion });
        } else if (type === 'directe') {
            // Pour les questions directes
            if (!reponse || !tolerance) {
                return res.status(400).json({ message: 'Données manquantes pour la question directe' });
            }

            // Enregistrer la question directe dans la base de données
            const newDirectQuestion = new DirectQuestion({
                type,
                question,
                reponse,
                tolerance
            });

            await newDirectQuestion.save();
            return res.status(200).json({ message: 'Question directe ajoutée avec succès', data: newDirectQuestion });
        } else {
            return res.status(400).json({ message: 'Type de question non valide' });
        }

    } catch (error) {
        console.error('Erreur serveur:', error);
        return res.status(500).json({ message: 'Erreur lors de l’enregistrement de la question' });
    }
});*/


/*app.post('/ajouter-question', async (req, res) => {
    console.log("Données reçues:", req.body); // Affiche les données reçues du client

    try {
        const { type, examenId, question, reponses, reponseCorrecte, reponseAttendue, tolerance } = req.body;
        
        if (!type || !examenId || !question) {
            return res.status(400).json({ message: "Données manquantes" });
        }
        
        let nouvelleQuestion;
        if (type === 'qcm') {
            if (!reponses || !reponseCorrecte) {
                return res.status(400).json({ message: "Les réponses et la bonne réponse sont requises pour un QCM" });
            }

            nouvelleQuestion = new Question({
                type: 'qcm',
                examenId,
                question,
                reponses,
                reponseCorrecte
            });
        } else if (type === 'directe') {
            if (!reponseAttendue || isNaN(tolerance)) {
                return res.status(400).json({ message: "Les réponses attendues et la tolérance sont requises pour une question libre" });
            }

            nouvelleQuestion = new Question({
                type: 'libre',
                examenId,
                question,
                reponseAttendue,
                tolerance
            });
        }

        await nouvelleQuestion.save();
        res.status(201).json(nouvelleQuestion);
    } catch (err) {
        console.error("Erreur lors de l'ajout de la question:", err);
        res.status(500).json({ message: "Erreur lors de l'enregistrement de la question" });
    }
});*/


/*app.post('/ajouter-question', async (req, res) => {
    const { type, examenId, question, reponses, reponseCorrecte, reponseAttendue, tolerance } = req.body;

    // Vérifie que toutes les données nécessaires sont présentes
    if (!type || !examenId || !question) {
        return res.status(400).json({ message: "Données manquantes" });
    }

    try {
        let nouvelleQuestion;

        if (type === 'qcm') {
            if (!reponses || !reponseCorrecte) {
                return res.status(400).json({ message: "Les réponses et la bonne réponse sont requises pour un QCM" });
            }

            nouvelleQuestion = new Question({
                type: 'qcm',
                examenId,
                question,
                reponses,
                reponseCorrecte
            });
        } else if (type === 'directe') {
            if (!reponseAttendue || isNaN(tolerance)) {
                return res.status(400).json({ message: "Les réponses attendues et la tolérance sont requises pour une question directe" });
            }

            nouvelleQuestion = new Question({
                type: 'libre',
                examenId,
                question,
                reponseAttendue,
                tolerance
            });
        }

        // Sauvegarde la question dans la base de données
        await nouvelleQuestion.save();

        res.status(201).json(nouvelleQuestion);
    } catch (err) {
        console.error('Erreur lors de l’ajout de la question :', err);
        res.status(500).json({ message: 'Erreur lors de l’ajout de la question' });
    }
});*/

 /*const newQuestion = new Question({
                type,
                question,
                options: [option1, option2, option3],
                correctAnswer: reponse1, // La bonne réponse
                note,
                duree
            });*/





            
/*app.post('/questions', async (req, res) => {
    try {
        const { type, examenId, question, reponses, reponseCorrecte, note, duree } = req.body;

        // Validation des données
        if (!type || !examenId || !question || !note || !duree) {
            return res.status(400).json({ message: "Tous les champs requis doivent être remplis." });
        }

        if (type === 'qcm' && (!reponses || reponses.length < 2 || !reponseCorrecte)) {
            return res.status(400).json({ message: "Pour un QCM, il faut au moins deux options et une réponse correcte." });
        }

        // Création de la nouvelle question
        const newQuestion = new Question({
            type,
            examenId,
            question,
            reponses: JSON.parse(reponses),
            reponseCorrecte: JSON.parse(reponseCorrecte),
            note,
            duree,
        });

        await newQuestion.save();
        res.status(201).json({ message: "Question ajoutée avec succès !" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur interne du serveur." });
    }
});*/



// Route pour gérer l'ajout d'une question
/*app.post('/questions', async (req, res) => {
    try {
        const { type, examenId, question, reponseAttendue, tolerance, note, duree } = req.body;

        // Validation des champs obligatoires
        if (!type || !examenId || !question) {
            return res.status(400).json({ message: "Les champs 'type', 'examenId' et 'question' sont obligatoires." });
        }

        if (type === 'directe') {
            if (!reponseAttendue || !tolerance) {
                return res.status(400).json({ message: "Les champs 'réponse attendue' et 'tolérance' sont obligatoires pour une question directe." });
            }
        }

        // Création de la question
        const newQuestion = new Question({
            type,
            examenId,
            question,
            reponseAttendue: type === 'directe' ? reponseAttendue : undefined,
            tolerance: type === 'directe' ? tolerance : undefined,
            note,
            duree,
        });

        await newQuestion.save();
        res.status(201).json({ message: "Question ajoutée avec succès !" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur interne du serveur." });
    }
});*/







// Route pour enregistrer une question avec gestion de fichier
/*app.post("/examens/:examenId/questions", upload.single("file"), async (req, res) => {
  try {
    const { type } = req.body;
    const examenId = req.params.examenId;

    let nouvelleQuestion = {
      examenId,
      type,
      question: req.body.question,
      fileUrl: req.file ? `/uploads/${req.file.filename}` : null,
    };

    if (type === "qcm") {
      nouvelleQuestion.options = JSON.parse(req.body.options || "[]");
      nouvelleQuestion.note = req.body.note;
      nouvelleQuestion.duree = req.body.duree;

    } else if (type === "directe") {
      nouvelleQuestion.reponse = req.body.reponse;
      nouvelleQuestion.tolerance = req.body.tolerance;
    } else {
      return res.status(400).json({ error: "Type de question invalide." });
    }

    const questionCreee = await Question.create(nouvelleQuestion);
    res.status(201).json({ message: "Question enregistrée", question: questionCreee });

  } catch (error) {
    console.error("Erreur:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});*/