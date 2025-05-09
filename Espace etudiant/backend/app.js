// app.js
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(session({ secret: 'votre_secret', resave: false, saveUninitialized: true }));

// Utilisateurs fictifs pour l'exemple
let users = [{ username: 'test', password: 'test' }];
let results = {};

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (users.find(u => u.username === username)) return res.status(400).send('Utilisateur existe');
    users.push({ username, password });
    res.sendStatus(201);
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) return res.status(401).send('Identifiants invalides');
    req.session.user = username;
    res.sendStatus(200);
});

app.post('/geolocate', (req, res) => {
    if (!req.session.user) return res.status(401).send('Non connecté');
    // Enregistre la géoloc (latitude, longitude)
    results[req.session.user] = { geoloc: req.body, score: null };
    res.sendStatus(200);
});

app.post('/submit-exam', (req, res) => {
    if (!req.session.user) return res.status(401).send('Non connecté');
    // Calcul du score sur 100
    results[req.session.user].score = req.body.score;
    res.sendStatus(200);
});

app.get('/score', (req, res) => {
    if (!req.session.user) return res.status(401).send('Non connecté');
    res.json({ score: results[req.session.user]?.score });
});

app.listen(3000, () => console.log('Serveur lancé sur http://localhost:3000'));
