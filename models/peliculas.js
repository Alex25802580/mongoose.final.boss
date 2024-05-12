const mongoose = require('mongoose');

const peliculaSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    duracion: { type: String, required: true },
    premios: { type: Number, required: true },
    descripcion: { type: String, required: false },
    imagen: { type: String, required: false },
    director: { type: mongoose.Schema.Types.ObjectId, ref: 'Director' } // Referencia al modelo Director
});

const Pelicula = mongoose.model('Pelicula', peliculaSchema, 'peliculas');

module.exports = Pelicula;