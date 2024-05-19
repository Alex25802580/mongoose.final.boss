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

const Schema = mongoose.Schema;

const peliculaSchema = new Schema({
    nombre: String,
    duracion: String,
    premios: Number,
    imagen: String,
    director: {
        type: Schema.Types.ObjectId,
        ref: 'Director' // Nombre del modelo al que se hace referencia
    }
});

module.exports = mongoose.model('peliculas', peliculaSchema);


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

const Director = require('./models/Director');

const director = require('./models/Director'); // Importa el modelo Director
const pelicula = require('./models/peliculas'); // Importa el modelo Pelicula
/**
 * @swagger
 * /api/directores:
 *   get:
 *     summary: Obtener todos los directores
 *     responses:
 *       200:
 *         description: Lista de directores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Director'
 */


// MUESTRA TODOS LOS directores
app.get('/api/directores', async (req, res) => {
    const directores = await director.find({});
    res.send(directores)

});
/**
 * @swagger
 * /api/directores/{id}:
 *   get:
 *     summary: Obtener un director por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Director encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Director'
 *       404:
 *         description: Director no encontrado
 */
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

/**
 * @swagger
 * /api/directores/update/{id}:
 *   post:
 *     summary: Actualizar un director por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Datos del director a actualizar
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Director'
 *     responses:
 *       200:
 *         description: Director actualizado correctamente
 *       404:
 *         description: Director no encontrado
 */
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

/**
 * @swagger
 * /api/peliculas/update/{id}:
 *   post:
 *     summary: Actualizar una película por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Datos de la película a actualizar
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pelicula'
 *     responses:
 *       200:
 *         description: Película actualizada correctamente
 *       404:
 *         description: Película no encontrada
 */
app.post("/api/peliculas/update/:id", async (req, res)=>{
    let id = req.params.id;
    let params = req.body;
    console.log(params)
    try{
        const peliculaUpdate = await pelicula.findOneAndUpdate({_id: id},{$set: params},{new: true});
        if (!peliculaUpdate){
            res.status(404).json({succes: false, message: 'No econtrado, Error'})
        }

        res.status(200).json({success: true, message: 'Updatedado Correctamente'});
        console.log('Updateado id: ', id)
    } catch (error){
        console.log(error)
        res.send('Error en el servidor.')
    }
});

/**
 * @swagger
 * /api/directores/{id}:
 *   delete:
 *     summary: Eliminar un director por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Director eliminado correctamente
 *       404:
 *         description: Director no encontrado
 */


app.delete('/api/directores/:id', async (req, res)=>{
    const id = req.params.id
    try{
        const deletedDirector = await director.deleteOne({_id:id});
        console.log(deletedDirector)
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

/**
 * @swagger
 * /api/directores:
 *   post:
 *     summary: Insertar un nuevo director
 *     requestBody:
 *       description: Datos del nuevo director
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Director'
 *     responses:
 *       200:
 *         description: Director insertado correctamente
 */
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


/**
 * @swagger
 * /api/peliculas:
 *   get:
 *     summary: Obtener todas las películas
 *     responses:
 *       200:
 *         description: Lista de películas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pelicula'
 */
app.get('/api/peliculas',async (req, res) => {
    try{
        const peliculas = await pelicula.find({});
        res.send(peliculas);
    }catch (e) {
        console.log(e)
    }
});

/**
 * @swagger
 * /api/peliculas/{id}:
 *   get:
 *     summary: Obtener una película por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Película encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pelicula'
 *       404:
 *         description: Película no encontrada
 */
app.get('/api/peliculas/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const result = await pelicula.findById(id);
        if (result) {
            res.send(result);
        } else {
            res.status(404).send("Pelicula no encontrada");
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Error en el servidor");
    }
});



/**
 * @swagger
 * /api/peliculas/update/{id}:
 *   post:
 *     summary: Actualiza una película por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la película a actualizar.
 *         schema:
 *           type: string
 *       - in: body
 *         name: body
 *         required: true
 *         description: Datos actualizados de la película.
 *         schema:
 *           type: object
 *           properties:
 *             nombre:
 *               type: string
 *             duracion:
 *               type: string
 *             premios:
 *               type: number
 *             imagen:
 *               type: string
 *             director:
 *               type: string
 *     responses:
 *       200:
 *         description: Película actualizada correctamente.
 *       404:
 *         description: Película no encontrada.
 */
app.post("/api/peliculas/update/:id", async (req, res) => {
    let id = req.params.id;
    let dataBody = req.body;
    console.log(dataBody)
    try {
        await pelicula.findOneAndUpdate(
            {_id: id},
            {$set: dataBody},
            {new: true}
        );
        res.send('Updateado correctamente')
    } catch (error) {
        console.log(error)
        res.send('Error en el servidor.')
    }
});

/**
 * @swagger
 * /api/peliculas/{id}:
 *   delete:
 *     summary: Elimina una película por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la película a eliminar.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Película eliminada correctamente.
 *       404:
 *         description: Película no encontrada.
 */
app.delete('/api/peliculas/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const deletedPelicula = await pelicula.deleteOne({ _id: id });
        console.log(deletedPelicula);
        if (deletedPelicula) {
            res.send({}); // Envía una respuesta vacía
        } else {
            res.status(404).send('Pelicula no encontrada');
        }
    } catch (e) {
        console.log(e);
        res.send('Error en el servidor');
    }
});

/**
 * @swagger
 * /api/peliculas:
 *   post:
 *     summary: Inserta una nueva película.
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: Datos de la nueva película.
 *         schema:
 *           type: object
 *           properties:
 *             nombre:
 *               type: string
 *             duracion:
 *               type: string
 *             premios:
 *               type: number
 *             imagen:
 *               type: string
 *             director:
 *               type: string
 *     responses:
 *       200:
 *         description: Película insertada correctamente.
 */
app.post('/api/peliculas', async (req, res) => {
    const params = req.body;
    console.log(params);
    try {
        const nuevaPelicula = await pelicula.create(params);
        console.log('Insertada', nuevaPelicula);
        res.send('Insertada correctamente');
    } catch (error) {
        console.error(error);
        res.send('Error en el servidor');
    }
});


//WEB///

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
app.get('/peliculas/insert', async (req,res)=>{
    const directores = await director.find({});
    res.render('insert_peliculas',
                {title: 'Insertar Película',
                    directores: directores
                }
                )
    });
app.get('/directores/insert', (req,res)=>{
    res.render('insert_directores', {
        title: 'Insertar Director',
        directores: { nombre: '', nacionalidad: '', genero: '', imagen: '' }
    });
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
//UPDATE ITEM
app.get('/peliculas/update/:id', async (req, res) => {
    const id = req.params.id
    const query = await pelicula.find({_id: id});
    const directores = await Director.find({});
    console.log(query)
    const params = {
        title: 'Update Pelicula',
        peliculas: query[0],
        directores: directores
    }
    res.render('update_peliculas', { directores: directores, pelicula: pelicula });});


//Update quipo
app.post("/peliculas/update", async (req, res) => {
    try {
        const {id,nombre, duracion, premios, imagen, director} = req.body;
        const directorSelec = await Director.find({_id: director})
        const nuevaPelicula = await pelicula.findOneAndUpdate({_id: id}, {
                nombre,
                duracion,
                premios,
                imagen,
                director: directorSelec[0]
            },
            {new: false});
        console.log('insertado!', nuevaPelicula)

        res.redirect('/peliculas');
    } catch (error) {
        console.error(error);
        res.send(500);
    }
});


//INSERT ITEM GET: show form


//Insertar pelicula
app.post('/peliculas/insert', async (req, res) => {
    const {nombre, duracion, premios, imagen, director} = req.body;
    // console.log(params)
    try {
        const directorSelec = await Director.find({_id: director})
        const nuevaPelicula = await pelicula.create({
            nombre,
            duracion,
            premios,
            imagen,
            director: directorSelec[0]
        });
        console.log('insertado!', nuevaPelicula)
        res.redirect('/peliculas')
    } catch (e) {
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
// Update director
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

