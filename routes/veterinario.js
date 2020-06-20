const express = require('express');
const app = express();
let Veterinario = require('../models/veterinario');
const authToken = require('../middlewares/autenticacion');


app.get('/', (req, resp, next) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Veterinario.find({})
        .populate('usuario', 'nombre email')
        .populate('centroVeterinario')
        .skip(desde)
        .limit(5)
        .exec(
            (err, veterinarios) => {
                if (err) {
                    return resp.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando veterinarios',
                        errors: err
                    });
                }
                Veterinario.count({}, (err, contador) => {
                    resp.status(200).json({
                        ok: true,
                        veterinarios,
                        totalRegistros: contador
                    });
                })
            });
});

// actualizar veterinario
app.put('/:id', authToken.verificaToken, (req, resp) => {
    let id = req.params.id;
    let body = req.body;

    Veterinario.findById(id, (err, veterinario) => {
        if (err) {
            return resp.status(500).json({
                ok: false,
                mensaje: 'Error al buscar veterinario',
                errors: err
            });
        }
        if (!veterinario) {
            return resp.status(400).json({
                ok: false,
                mensaje: `el veterinario con el id: ${id}, no existe`,
                errors: { message: 'no existe un veterinario con ese id' }
            });
        }

        veterinario.nombre = body.nombre;
        veterinario.usuario = req.usuario._id;
        veterinario.centroVeterinario = body.centroVeterinario;

        veterinario.save((err, veterinarioGuardado) => {
            if (err) {
                return resp.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar veterinario',
                    errors: err
                });
            }
            resp.status(200).json({
                ok: true,
                message: veterinarioGuardado
            });
        });
    });
});

// crear veterinario
app.post('/', authToken.verificaToken, (req, resp) => {

    let body = req.body;

    let veterinario = new Veterinario({
        nombre: body.nombre,
        usuario: req.usuario._id,
        centroVeterinario: body.centroVeterinario
    });
    veterinario.save((err, veterinarioGuardado) => {
        if (err) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'Error al guardar veterinario',
                errors: err
            });
        }
        resp.status(201).json({
            ok: true,
            veterinario: veterinarioGuardado
        });
    });
})

// eliminar veterinario
app.delete('/:id', authToken.verificaToken, (req, resp) => {

    let id = req.params.id;

    Veterinario.findByIdAndRemove(id, (err, veterinarioBorrado) => {
        if (err) {
            return resp.status(500).json({
                ok: false,
                mensaje: 'Error al borrar veterinario',
                errors: err
            });
        }
        if (!veterinarioBorrado) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'No existe veterinario con ese id',
                errors: { message: 'No existe veterinario con ese id' }
            });
        }
        resp.status(200).json({
            ok: true,
            veterinario: veterinarioBorrado
        });
    });
});

module.exports = app;