


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


/*const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  examenId: { type: mongoose.Schema.Types.ObjectId, ref: "Examen", required: true },
  type: { type: String, enum: ["qcm", "directe"], required: true },
  question: { type: String, required: true },
  note: Number,
  duree: Number,
  options: [String],
  reponse: String,
  tolerance: Number,
  fileUrl: String,
});

module.exports = mongoose.model("Question", questionSchema);*/




// models/Questions.js
/*const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  type: String, // "qcm" ou "directe"
  question: String,
  options: [String], // Pour les QCM
  bonnesReponses: [String], // Pour les QCM
  reponse: String, // Pour les directes
  tolerance: Number, // Pour les directes
  note: Number,
  duree: Number,
  file: String,
  examId: String
});

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;*/



// models/Question.js
/*const mongoose = require('mongoose');

// Définir le modèle de la question directe
const QuestionSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    question: {
        type: String,
        required: true
    },
    reponse: {
        type: String,
        required: true
    },
    tolerance: {
        type: Number,
        required: true
    }
});

const Question = mongoose.model('Question', QuestionSchema);
module.exports = Question;*/



/*const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    examenId: { type: mongoose.Schema.Types.ObjectId, ref: 'Examens', required: true },
    type: { type: String, enum: ['qcm', 'directe'], required: true },
    question: { type: String, required: true },
    reponses: [String], // Pour QCM
    reponseCorrecte: [String], // Tableau pour cocher plusieurs bonnes réponses
    reponseAttendue: String, // Pour question directe
    tolerance: Number, // Pour question directe

    //note: { type: Number, required: true },
    //duree: { type: Number, required: true }
}, { timestamps: true  });

module.exports = mongoose.model('Question', questionSchema);*/





/*const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    examenId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Examens',
        required: true
    },
    type: {
        type: String,
        enum: ['qcm', 'libre'], // QCM ou question à réponse libre
        required: true
    },
    question: {
        type: String,
        required: true
    },
    reponses: [String], // Optionnel, seulement pour QCM
    reponseCorrecte: String // Index de la bonne réponse, si QCM
});

module.exports = mongoose.model('Question', questionSchema);*/
