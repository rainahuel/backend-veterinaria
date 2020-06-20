const express = require('express');
const app = express();
let CentroVeterinario = require('../models/centroVeterinario');
const authToken = require('../middlewares/autenticacion');

// obtener centros veterinarios
app.get('/', (req, resp, next) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    CentroVeterinario.find({})
        .populate('usuario', 'nombre email')
        .skip(desde)
        .limit(5)
        .exec(
            (err, centrosVeterinarios) => {
                if (err) {
                    return resp.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando veterinarias',
                        errors: err
                    });
                }
                CentroVeterinario.count({}, (err, contador) => {
                    resp.status(200).json({
                        ok: true,
                        centrosVeterinarios,
                        totalRegistros: contador
                    });
                })
            });
});

// actualizar centro veterinario veterinaria
app.put('/:id', authToken.verificaToken, (req, resp) => {
    let id = req.params.id;
    let body = req.body;

    CentroVeterinario.findById(id, (err, centroVeterinario) => {
        if (err) {
            return resp.status(500).json({
                ok: false,
                mensaje: 'Error al buscar veterinaria',
                errors: err
            });
        }
        if (!centroVeterinario) {
            return resp.status(400).json({
                ok: false,
                mensaje: `la veterinaria con el id: ${id}, no existe`,
                errors: { message: 'no existe una veterinaria con ese id' }
            });
        }

        centroVeterinario.nombre = body.nombre;
        centroVeterinario.usuario_id = req.usuario._id;

        centroVeterinario.save((err, centroVeterinarioGuardado) => {
            if (err) {
                return resp.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar veterinaria',
                    errors: err
                });
            }
            resp.status(200).json({
                ok: true,
                centroVeterinario: centroVeterinarioGuardado
            });
        });
    });
});

// crear centro veterinario
app.post('/', authToken.verificaToken, (req, resp) => {

    let body = req.body;

    let centroVeterinario = new CentroVeterinario({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    centroVeterinario.save((err, centroVeterinarioGuardado) => {
        if (err) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'Error al guardar el centro veterinario',
                errors: err
            });
        }
        resp.status(201).json({
            ok: true,
            centroVeterinario: centroVeterinarioGuardado
        });
    });
});

app.delete('/:id', authToken.verificaToken, (req, resp) => {

    let id = req.params.id;

    CentroVeterinario.findByIdAndRemove(id, (err, centroVeterinarioEliminado) => {

        if (err) {
            return resp.status(500).json({
                ok: false,
                mensaje: 'Error al borrar el centro veterinario',
                errors: err
            });
        }
        if (!centroVeterinarioEliminado) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'No existe un centro veterinario con ese id',
                errors: { message: 'No existe centro veterinario con ese id' }
            });
        }
        resp.status(200).json({
            ok: true,
            centroVeterinario: centroVeterinarioEliminado
        });
    });
});

module.exports = app;