var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var app = express();

const mongoURI = 'mongodb://localhost:27017/Cine';

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', (error) => {
    console.error('Error al conectar a la base de datos:', error);
});
db.once('open', () => {
    console.log('Conexión a la base de datos establecida correctamente');
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


const director = require('./models/Director'); // Importa el modelo Director
const pelicula = require('./models/peliculas'); // Importa el modelo Pelicula


// MUESTRA TODOS LOS directores
app.get('/api/directores', async (req, res) => {
    const directores = await director.find({});
    res.send(directores)

});

// ITEMS DETAIL
app.get('/api/directores/:id', async (req, res) => {
    const id = req.params.id
    const result = await director.findById(id);
    if (director){
        res.send(director);
    }else {
        res.status(500).send("Error");
    }
    res.send(result);
});

// HACER UPDATE A UN ITEM EN CONCRETO A TRAVES DE ID
app.post("/api/directores/update/:id", async (req, res)=>{
    let id = req.params.id;
    let params = req.body;
    console.log(params)
    try{
        const directorUpdate = await director.findOneAndUpdate({_id: id},{$set: params},{new: true});
        if (!directorUpdate){
            res.status(404).json({succes: false, message: 'No econtrado, Error'})
        }
        res.status(200).json({succes: true, message: 'Updateado Correctamente'})
        console.log('Updateado id: ', id)
    } catch (error){
        console.log(error)
        res.send('Error en el servidor.')
    }
});


// ELIMINAR UN ITEM DE DIRECTORES POR ID
app.delete('/api/directores/:id', async (req, res)=>{
    const id = req.params.id
    try{
        const eliminarDirector = await director.deleteOne({_id:id});
        console.log(eliminarDirector)
        if (deletedDirector) {
            res.send('Director eliminado correctamente');
        } else {
            res.status(404).send('Director no encontrado');
        }
    }catch (e){
        console.log(e);
        res.send('Error en el servidor')
    }
});

// INSERTAR UN NUEVO ITEM A Directores
app.post('/api/directores', async (req, res)=>{
    const params = req.body;
    console.log(params);
    try{
        await director.create(params)
        res.send('Insertado correctamente')
    }catch (e) {
        console.log(e)
        res.send('Error en el servidor')
    }

});

//////////////////////////// PEliculas ///////////////////////////////


// MUESTRA TODAS LAS PELICULAS
app.get('/api/peliculas',async (req, res) => {
    try{
        const peliculas = await pelicula.find({});
        res.send(peliculas);
    }catch (e) {
        console.log(e)
    }
});

// ITEMS DETAIL
app.get('/api/peliculas/:id',async (req, res)=>{
    const id = req.params.id
    const result = await pelicula.findById(id);
    res.status(200).send(result)
});



// HACER UPDATE A UN ITEM EN CONCRETO A TRAVES DE ID
app.post("/api/peliculas/update/:id", async (req, res)=>{
    let id = req.params.id;
    let params = req.body;
    console.log(params)
    try{
        const peliculaUpdated = await pelicula.findOneAndUpdate({_id: id},{$set: params},{new: true});

        res.status(200).json({success: true, message: 'Updatedado Correctamente'});
        console.log('Updateado id: ', id)
    } catch (error){
        console.log(error)
        res.send('Error en el servidor.')
    }
});

// ELIMINAR UN ITEM DE PELICULA POR ID
app.delete('/api/peliculas/:id',async (req, res)=>{
    const id = req.params.id
    try{
        const peliculaElim = await pelicula.deleteOne({_id:id});
        console.log(peliculaElim)
        if (peliculaElim) {
            res.send('Pelicula eliminado correctamente');
        } else {
            res.status(404).send('Pelicula no encontrado');
        }
    }catch (e){
        console.log(e);
        res.send('Error en el servidor')
    }
});

// INSERTAR UN NUEVO ITEM A PELICULA
app.post('/api/peliculas', async (req, res)=>{
    const params = req.body;
    console.log(params);
    try{
        await pelicula.create(params);
        res.send('Insertada correctamente')
    }catch (e) {
        console.log(e)
        res.send('Error en el servidor')
    }
});

////////////////////////////////////////// WEB //////////////////////////////////////
//////////////////////////// PELICULA ///////////////////////////////

// INDEX
app.get('/', (req, res) => {
    res.render('index',{title:'Cine'})
});

app.get('/contacto', (req, res) => {
    res.render('contacto',{title:'Contacto'})
});
app.get('/about', (req, res) => {
    res.render('about',{title:'About'})
});

app.get('/directores/detalles/:id',async (req, res) => {
    const id = req.params.id
    const query = await director.findById(id);
    console.log(query)
    const params = {
        title: 'Detalles Director',
        director: query
    }
    res.render('detalles_directores', params)
});

app.get('/peliculas/detalles/:id',async (req, res) => {
    const id = req.params.id
    const query = await pelicula.findById(id);
    console.log(query)
    const params = {
        title: 'Detalles Pelicula',
        pelicula: query
    }
    res.render('detalles_peliculas', params)
});

// Show ALL Items
app.get('/peliculas', async (req, res) => {
    const query = await pelicula.find({})
    // console.log(query)
    const params = {
        title: 'Peliculas',
        peliculas: query
    }
    console.log(params)
    res.render('peliculas', params);
});
// UPDATE ITEM
app.get('/peliculas/update/:id', async (req,res)=>{
    const id = req.params.id
    const query = await pelicula.findById(id);
    console.log(query)
    const params = {
        title: 'Update Pelicula',
        peliculas: query
    }
    res.render('update_peliculas', params)
});

// Update quipo
app.post("/peliculas/update", async (req, res)=>{
    const {_id,nombre,duracion,premios,imagen} = req.body
    console.log('params',{_id,nombre,duracion,premios,imagen})
    try {
        const result = await pelicula.findByIdAndUpdate(_id,{_id,nombre,duracion,premios,imagen},{new:true});
        console.log('insertada!', result)
        res.redirect('/peliculas')
    }catch (e) {
        console.log(e)
        res.status(500).send('error en el servidor')
    }
});
// INSERT ITEM GET: show form
app.get('/piliculas/insert', (req,res)=>{
    res.render('insert_peliculas',
        {title:'insert pelicula'}
    )
});

//Insertar pelicula
app.post('/piliculas/insert',async (req, res)=>{
    const {_id,nombre,duracion,premios,imagen,} = req.body
    console.log('params',{_id,nombre,duracion,premios,imagen})
    try {
        const result = await pelicula.create({nombre,duracion,premios,imagen})
        console.log('insertado!', result)
        res.redirect('/peliculas')
    }catch (e) {
        console.log(e)
        res.status(500).send('error en el servidor')
    }
});

//////////////////////////// DIRECTORES ///////////////////////////////

// Show ALL Items


app.get('/directores', async (req, res) => {
    const query = await director.find({})
    // console.log(query)
    const params = {
        title: 'Directores',
        directores: query
    }
    console.log(params)
    res.render('directores', params);
});
// Update quipo
app.post("/directores/update", async (req, res)=>{
    const {_id,nombre,nacionalidad,genero,imagen} = req.body;
    console.log('params',{_id,nombre,nacionalidad,genero,imagen})
    try {
        const result = await director.findByIdAndUpdate(_id, {nombre,nacionalidad,genero,imagen},{new:true});
        console.log('insertado!', result)
        res.redirect('/directores')
    }catch (e) {
        console.log(e)
        res.status(500).send('error en el servidor')
    }
});
// INSERT ITEM GET: show form
app.get('/directores/insert', (req,res)=>{
    res.render('insert_directores',
        {title:'insert directores'}
    )
});
// INSERT ITEM POST: get params and do your mojo!
app.post('/directores/insert',async (req, res)=>{
    const {_id, nombre,nacionalidad,genero,imagen} = req.body;
    console.log('params',{_id,nombre,nacionalidad,genero,imagen})
    try {
        const result = await director.create({nombre,nacionalidad,genero,imagen})
        console.log('insertado!', result)
        res.redirect('/directores')
    }catch (e) {
        console.log(e)
        res.status(500).send('error en el servidor')
    }
});
// UPDATE ITEM
app.get('/directores/update/:id', async (req,res)=>{
    const id = req.params.id
    const query = await director.findById(id);
    console.log(query)
    const params = {
        title: 'Update Director',
        item: query
    }
    res.render('update_directores', params)
});



// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
module.exports = app;
app.use(express.static(path.join(__dirname, 'views', 'partials')));

