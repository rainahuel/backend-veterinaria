const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
let Usuario = require('../models/usuario');
var SEED = require('../config/config').SEED;

app.post('/', (req, resp) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return resp.status(500).json({
                ok: false,
                mensaje: 'error al buscar usuario',
                errors: err
            });
        }
        if (!usuarioDB) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'credenciales incorrectas - email',
                errors: err
            });
        }
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'credenciales incorrectas -password',
                errors: err
            });
        }
        //crear Token
        usuarioDB.password = '°-°';
        let token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 7200 });

        resp.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token,
            id: usuarioDB._id
        });
    })
})



module.exports = app;