const express = require('express');
const cors = require('cors'); 
const app = express();

app.use(cors()); 
app.use(express.json()); 

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

app.listen(3000, () => {
    console.log("Serveur démarré sur le port 3000");
});
