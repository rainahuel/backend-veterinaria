// requires 
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// inicializar variables
let app = express();

// body-parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json());

// importar rutas 
const appRoutes = require('./routes/app');
const usuarioRoutes = require('./routes/usuario');
const loginRoutes = require('./routes/login');
const centroVeterinarioRoutes = require('./routes/centroVeterinario');
const veterinarioRoutes = require('./routes/veterinario');
const busquedaRoutes = require('./routes/busqueda');
const uploadRouted = require('./routes/upload');
const imagenesRouted = require('./routes/imagenes');

// conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/veterinaria', (err, resp) => {
    if (err) throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
});

// rutas
app.use('/img', imagenesRouted);
app.use('/upload', uploadRouted);
app.use('/busqueda', busquedaRoutes);
app.use('/veterinario', veterinarioRoutes);
app.use('/centroVeterinario', centroVeterinarioRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);



// escuchar peticiones
app.listen(3000, () => {
    console.log('express server corriendo en el puerto 3000: \x1b[32m%s\x1b[0m', 'online');
})