const mongoose = require('mongoose');

const peliculaSchema = new mongoose.Schema({
    director_id: { type: String, required: true },
    nombre: { type: String, required: true },
    duracion: { type: String, required: true },
    premios: { type: Number, required: true },
    imagen: { type: String, required: true },
    director: { type: String, required: true }
});

const Pelicula = mongoose.model('Pelicula', peliculaSchema, 'peliculas');

module.exports = Pelicula;
