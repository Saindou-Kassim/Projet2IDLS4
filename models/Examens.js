const mongoose = require('mongoose');

const examenSchema = new mongoose.Schema({
    titre: { type: String, required: true},
    description: { type: String, required: true},
    public: { type: String, required: true},
    date: { type: Date, default: Date.now}
});

const Examen = mongoose.model('Examens', examenSchema);

module.exports = Examen;