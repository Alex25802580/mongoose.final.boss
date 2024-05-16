const mongoose = require('mongoose');

const peliculaSchema = new mongoose.Schema({
    director: {
        _id:mongoose.Schema.Types.ObjectId,
        nombre: String,
        nacionalidad: String,
        genero: String,
        descripcion: String,
        imagen: String,
    },
    nombre: String,
    duracion: String,
    premios: String,
    descripcion: String,
    imagen: String,


});

const Pelicula = mongoose.model('Pelicula', peliculaSchema);

module.exports = Pelicula;

