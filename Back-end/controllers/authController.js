const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Générer un JWT
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Contrôleur pour la connexion
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Vérifie si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Identifiants invalides' });

    // Vérifie le mot de passe
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Identifiants invalides' });

    // Génère le token JWT
    const token = createToken(user._id);

    // Envoie le token dans un cookie HTTPOnly
    res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 }); // 1h
    res.status(200).json({ message: 'Connexion réussie', userId: user._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Contrôleur pour la déconnexion
exports.logout = (req, res) => {
  res.clearCookie('jwt');
  res.status(200).json({ message: 'Déconnexion réussie' });
};
