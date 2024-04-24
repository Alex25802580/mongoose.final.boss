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
const directores = require('./models/Director.js')
db.on('error', (error) => {
    console.error('Error al conectar a la base de datos:', error);
});
const peliculas = require('./models/peliculas')
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



async function findDirectorByName(nombre) {
    try {
        const director = await Director.findOne({ Nombre: nombre });
        return director;
    } catch (error) {
        console.error('Error al buscar director en la base de datos:', error);
        return null;
    }
}

async function findDMovieByName(nombre) {
    try {
        const pelicula = await db('Películas').where('Nombre', nombre).first();
        return pelicula;
    } catch (error) {
        console.error('Error al buscar película en la base de datos:', error);
        return null;
    }
}

////PAGINA DIRECTORES
app.get('/directores', async (req, res) => {
    try {
        const directors = await directores.find({})
        console.log(directores2)
        res.render('directores', { title: 'Directores', directores: directores2 });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor al obtener los directores');
    }
});


/////PAGINA PELICULAS
app.get('/peliculas', async (req, res) => {
    try {
        const peliculas2  await peliculas.find({})
        res.render('peliculas', { title: 'Peliculas', peliculas: peliculas });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor al obtener las películas');
    }
});


/////MODIFICAR DIRECTOR POR NOMBRE
app.post("/api/directores/update_directores", async (req, res) => {
    const params = req.body;
    const nombreDirector = params.nombre;
    try {
        await db('Directores')
            .where('Nombre', '=', nombreDirector)
            .update({
                Nombre: params.nuevo_nombre,
                Nacionalidad: params.nacionalidad,
                Género: params.genero,
                Imagen: params.img
            });
        res.send('Director actualizado correctamente');
    } catch (error) {
        console.log(error);
        res.send('Error en el servidor al actualizar el director');
    }
});
/////MODIFICAR PELICULA POR NOMBRE
app.post('/api/peliculas/update_peliculas', async (req, res) => {
    const nombre = req.body.nombre;
    const nuevoNombre = req.body.nuevo_nombre;
    const duracion = req.body.duracion;
    const premios = req.body.premios;
    const imagen = req.body.imagen;
    const descripcion = req.body.descripcion;

    try {
        const pelicula = await findMovieByName(nombre); // Buscar la película por su nombre
        if (!pelicula) {
            return res.status(404).send('Película no encontrada');
        }
        await db('Películas').where('Nombre', nombre).update({
            Nombre: nuevoNombre,
            Duración: duracion,
            Premios: premios,
            Imagen: imagen,
            Descripción: descripcion
        });

        res.send('Película actualizada correctamente');
    } catch (error) {
        console.error('Error al actualizar la película:', error);
        res.status(500).send('Error en el servidor al actualizar la película');
    }
});



////// ELIMINAR DIRECTOR POR NOMBRE
app.post('/api/directores/delete_director', async (req, res) => {
    const nombre = req.body.nombre; // Obtener el nombre del director desde el cuerpo de la solicitud
    try {
        const director = await findDirectorByName(nombre);
        if (!director) {
            return res.status(404).send('Director no encontrado');
        }
        await db('Directores').where('Nombre', nombre).del();
        res.send('Director eliminado correctamente');
    } catch (error) {
        console.error('Error al eliminar director:', error);
        res.status(500).send('Error en el servidor al eliminar el director');
    }
});
//////ELIMINAR PELICULA POR NOMBRE
app.post('/api/peliculas/delete_pelicula', async (req, res) => {
    const nombre = req.body.nombre;
    try {
        const pelicula = await findDMovieByName(nombre);
        if (!pelicula) {
            return res.status(404).send('Película no encontrada');
        }
        await db('Películas').where('Nombre', nombre).del();
        res.send('Película eliminada correctamente');
    } catch (error) {
        console.error('Error al eliminar la película:', error);
        res.status(500).send('Error en el servidor al eliminar la películar');
    }
});

///// INSERTAR UN NUEVO DIRECTOR
app.post('/api/directores/insert_directores', async (req, res)=>{
    const params = req.body;
    console.log(params);
    try{
        await db('Directores').insert(params);
        res.send('Insertado correctamente')
    }catch (e) {
        console.log(e)
        res.send('Error en el servidor')
    }

});
///// INSERTAR NUEVA PELICULA
app.post('/api/peliculas/insert_peliculas', async (req, res)=>{
    const params = req.body;
    console.log(params);
    try{
        await db('Películas').insert(params);
        res.send('Insertado correctamente')
    }catch (e) {
        console.log(e)
        res.send('Error en el servidor')
    }

});





// INDEX
app.get('/', (req, res) => {
    res.render('index',{title:'WEB DE CINE'})
});
/// ABOUT
app.get('/about', (req, res) => {
    res.render('about', { title: 'Sobre mí' });
});
app.get('/directores', (req, res) => {
    res.render('directores', { title: 'Directores' }); // Asegúrate de que 'directores' sea el nombre correcto de tu plantilla HTML para la página de directores
});
app.get('/peliculas', (req, res) => {
    res.render('peliculas', { title: 'Peliculas' }); // Asegúrate de que 'directores' sea el nombre correcto de tu plantilla HTML para la página de directores
});

app.get('/directores/update_directores', (req, res) => {
    res.render('update_directores', { title: 'Modificar Director' }); // Asegúrate de que 'update_directores' sea el nombre correcto de tu plantilla HTML para la página de modificación de director
});
app.get('/peliculas/update_peliculas', (req, res) => {
    res.render('update_peliculas', { title: 'Modificar Película' }); // Asegúrate de que 'update_directores' sea el nombre correcto de tu plantilla HTML para la página de modificación de director
});

app.get('/directores/insert_directores', (req, res) => {
    res.render('insert_directores', { title: 'Insertar Director' });
});

app.get('/peliculas/insert_peliculas', (req, res) => {
    res.render('insert_peliculas', { title: 'Insertar Película' });
});

app.get('/directores/delete_director', (req, res) => {
    res.render('delete_director', { title: 'Borrar Director' });
});
app.get('/peliculas/delete_pelicula', (req, res) => {
    res.render('delete_pelicula', { title: 'Borrar Película' });
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
