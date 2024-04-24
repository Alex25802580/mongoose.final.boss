const mongoose = require('mongoose');
const {ObjectId} = require("mongodb");
const peliculaSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    pelicula_id: mongoose.Schema.Types.ObjectId
});
const Pelicula = mongoose.model('Pelicula', peliculaSchema);
module.exports = Pelicula