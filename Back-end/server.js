require('dotenv').config();
console.log("URI MongoDB :", process.env.MONGO_URI);
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware (IMPORTANT : dans cet ordre)
app.use(express.urlencoded({ extended: true })); // Pour les formulaires HTML
app.use(express.json()); // Pour les requêtes JSON
app.use(cookieParser());

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connexion à MongoDB'))
  .catch(err => console.error('Erreur de connexion à MongoDB:', err));

// database schema

const user_model = new mongoose.Schema({
  email:{
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true
  }
})
const users= new mongoose.model("users",user_model)
// Routes
app.use('/api/auth', authRoutes);

// Route test pour le formulaire (à remplacer par un vrai modèle)
//Database
app.post('/api/user', (req, res) => {
  const data={
    email: req.body.email,
    password: req.body.password
  }

  const userdata = users.create(data)

  console.log('Données du formulaire :', req.body);
  // Ici tu dois normalement sauvegarder avec Mongoose
  res.send('Données reçues, merci pour votre connexion!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
