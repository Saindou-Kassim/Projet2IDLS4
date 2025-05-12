


const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    type: { type: String, required: true },
    examenId: { type: mongoose.Schema.Types.ObjectId, ref: 'Examens', required: true },
    question: { type: String, required: true },
    reponses: { type: [String], default: undefined }, // Pour les QCM
    reponseCorrecte: { type: [String], default: undefined }, // Pour les QCM
    reponseAttendue: { type: String, default: undefined }, // Pour les questions directes
    tolerance: { type: Number, default: undefined }, // Pour les questions directes
    note: { type: Number, required: true },
    duree: { type: Number, required: true },
    file: { type: String }, // Chemin du fichier uploadé
}, { timestamps: true });

module.exports = mongoose.model('Question', QuestionSchema);


 