const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Récupérer le token depuis l'en-tête 'Authorization'

  if (!token) {
    return res.status(401).json({ message: 'Accès non autorisé' });
  }

  try {
    // Vérifier le token JWT
    const decoded = jwt.verify(token, 'ton_secret_jwt_key'); // Remplace par ta clé secrète

    // Ajouter l'utilisateur au requête pour l'utiliser dans la fonction de sauvegarde
    req.user = await User.findById(decoded.userId); 
    if (!req.user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    next(); // L'utilisateur est authentifié, on passe à la suite de la requête
  } catch (error) {
    res.status(400).json({ message: 'Token invalide ou expiré' });
  }
};

module.exports = { authenticate };
