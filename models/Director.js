const mongoose = require('mongoose');

const directorSchema = new mongoose.Schema({
    id: { type: String, required: true },
    nombre: { type: String, required: true },
    nacionalidad: { type: String, required: true },
    genero: { type: String, required: true },
    imagen: { type: String, required: true }
});

const Director = mongoose.model('Director', directorSchema);

module.exports = Director;
