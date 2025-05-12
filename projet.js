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
});
