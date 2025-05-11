const User = require('../models/User');

exports.saveLocation = async (req, res) => {
  // Récupérer les coordonnées envoyées dans le corps de la requête
  const { latitude, longitude } = req.body;
  const userId = req.user.id;  // Id de l'utilisateur récupéré depuis le JWT (middleware 'authenticate')

  try {
    // Mettre à jour les coordonnées de géolocalisation dans la base de données
    const updatedUser = await User.findByIdAndUpdate(
      userId, 
      { location: { latitude, longitude } }, 
      { new: true } // Pour renvoyer l'utilisateur mis à jour
    );

    res.status(200).json({
      message: "Géolocalisation enregistrée avec succès",
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'enregistrement de la géolocalisation" });
  }
};
