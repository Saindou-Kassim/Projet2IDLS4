const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const examRoutes = require('./routes/examRoutes');

app.use('/api/user', authRoutes);
app.use('/api/exam', examRoutes);

// Connexion à MongoDB locale via Compass
const LOCAL_DB_URI = 'mongodb://127.0.0.1:27017/PROJET2IDL'; // nom de la base locale : examDB

mongoose.connect(LOCAL_DB_URI, {
  //useNewUrlParser: true,
  //useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Connecté à MongoDB locale via Compass');
})
.catch(err => {
  console.error('❌ Erreur de connexion à MongoDB locale :', err);
});

module.exports = app;

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});
