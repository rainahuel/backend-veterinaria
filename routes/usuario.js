const express = require('express');
const bcrypt = require('bcryptjs');
const authToken = require('../middlewares/autenticacion');
const jwt = require('jsonwebtoken');
const app = express();

let Usuario = require('../models/usuario');

// obtener usuarios
app.get('/', (req, resp, next) => {
    Usuario.find({}, 'nombre email img role')
        .exec(
            (err, usuarios) => {
                if (err) {
                    return resp.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando usuarios',
                        errors: err
                    });
                }
                resp.status(200).json({
                    ok: true,
                    usuarios: usuarios
                });
            });
});

// actualizar usuario
app.put('/:id', authToken.verificaToken, (req, resp) => {

    let id = req.params.id;
    let body = req.body;

    Usuario.findById(id, (err, usuario) => {

        if (err) {
            return resp.status(500).json({
                ok: false,
                mensaje: 'Error al buscar el usuario',
                errors: err
            });
        }
        if (!usuario) {
            return resp.status(400).json({
                ok: false,
                mensaje: `el usuario con el id${id}, no existe`,
                errors: { message: 'no existe un usuario con ese id' }
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return resp.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });
            }
            usuarioGuardado.password = '°_°';
            resp.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });
        });
    });
});



// crear usuarios
app.post('/', authToken.verificaToken, (req, resp) => {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role,
    });

    usuario.save((err, usuarioGuardado) => {
        if (err) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'Error al guardar usuario',
                errors: err
            });
        }
        resp.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuarioToken: req.usuario
        });
    });
});

// eliminar usuario por id
app.delete('/:id', authToken.verificaToken, (req, resp) => {

    let id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

        if (err) {
            return resp.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: err
            });
        }
        if (!usuarioBorrado) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'No existe usuario con ese id',
                errors: { message: 'No existe usuario con ese id' }
            });
        }
        resp.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
});

module.exports = app;