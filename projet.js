const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require ('path');

const Examens = require('./models/Examens');  
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



app.post('/inscription', (req, res) => {    
    console.log('Données reçues:', req.body);

    
    const { typeUtilisateur, sexe, nom, prenom, email, naissance, etablissement, filiere } = req.body;


    if (!typeUtilisateur || !sexe || !nom || !prenom || !email || !naissance || !etablissement || !filiere) {
        return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    
    res.status(200).json({
        message: "Utilisateur inscrit avec succès ",
        data: { nom, email }
    });
});


app.get('/examens', async (req, res) => {
    try {
        const examens = await Examens.find(); 
        res.json(examens);
    } catch (error) {
        console.error('Erreur lors de la récupération des examens:', error);
        res.status(500).send('Erreur serveur');
    }
});

app.post('/examens', async (req, res) => {
    try {
        const { titre, description, public } = req.body;

        
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





app.get('/examens/:id', async (req, res) => {
    const examenId = req.params.id;
    try {
        
        if (!mongoose.Types.ObjectId.isValid(examenId)) {
            return res.status(400).json({ message: "ID d'examen invalide" });
        }

        const examen = await Examens.findById(examenId);
        if (!examen) {
            return res.status(404).json({ message: "Examen introuvable" });
        }

        res.json(examen); 
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
});

app.put('/examens/:id', async (req, res) => {
    try {
        const updated = await Examens.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: 'Examen non trouvé' });
        res.json({ message: 'Examen mis à jour avec succès', examen: updated });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});



app.delete('/examens/:id', async (req, res) => {
    try {
        const examenId = req.params.id;
        const deleted = await Examens.findByIdAndDelete(examenId);

        if (!deleted) {
            return res.status(404).json({ message: 'Examen non trouvé' });
        }

        res.json({ message: 'Examen supprimé avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});
app.use((req, res) => {
    res.status(404).json({ error: 'Page non trouvée' }); 
});


  
app.listen(3000, () => {
    console.log("Serveur démarré sur le port 3000");
});



