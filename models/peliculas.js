const mongoose = require('mongoose');

const peliculaSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    duracion: { type: String, required: true },
    premios: { type: Number, required: true },
    descripcion: { type: String, required: true },
    imagen: { type: String, required: false },
});

const Pelicula = mongoose.model('Pelicula', peliculaSchema, 'peliculas');

module.exports = Pelicula;
