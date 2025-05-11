const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  answer: { type: String, required: true },
  options: [String],  // Pour les QCM
  type: { type: String, enum: ['direct', 'qcm'], required: true },
  tolerance: { type: Number, default: 0 }, // Tolérance pour les questions directes
  duration: { type: Number, default: 30 }, // Durée en secondes
});

const examSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  questions: [questionSchema],
  link: { type: String, unique: true },
});

module.exports = mongoose.model('Exam', examSchema);
