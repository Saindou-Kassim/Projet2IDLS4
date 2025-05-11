const Exam = require('../models/Exam');
const jwt = require('jsonwebtoken');

// Fonction pour vérifier le token
function verifyToken(req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Accès non autorisé' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Token invalide' });
    req.userId = decoded.id;
    next();
  });
}

// Récupérer les examens
exports.getExams = [verifyToken, async (req, res) => {
  try {
    const exams = await Exam.find();
    res.json({ exams });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
}];

//C'est pour la partie 4.2(Espace enseignat)
// Créer un examen (depuis l'espace enseignant)
/*
exports.createExam = async (req, res) => {
  const { title, description, questions } = req.body;

  try {
    const newExam = new Exam({ title, description, questions });
    await newExam.save();
    res.status(201).json({ message: 'Examen créé', exam: newExam });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
*/