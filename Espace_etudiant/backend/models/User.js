const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: String,
  // Autres champs de l'utilisateur comme tu l'as déjà fait
  role: { type: String, enum: ['etudiant', 'enseignant'], required: true },
// Ajout du champ géolocalisation
location: {
    latitude: { type: Number },
    longitude: { type: Number }
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
