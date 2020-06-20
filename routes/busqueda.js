const express = require('express');
const app = express();
const CentroVeterinario = require('../models/centroVeterinario');
const Veterinarios = require('../models/veterinario');
const veterinario = require('../models/veterinario');
const Usuario = require('../models/usuario');







// busqueda por tablas
app.get('/coleccion/:tabla/:busqueda', (req, resp) => {

    let tabla = req.params.tabla;
    let busqueda = req.params.busqueda;
    let regExp = new RegExp(busqueda, 'i');
    let resultado;

    switch (tabla) {
        case 'centroVeterinario':
            resultado = buscarCentrosVeterinarios(regExp);
            break;
        case 'veterinarios':
            resultado = buscarVeterinarios(regExp);
            break;
        case 'usuarios':
            resultado = buscarUsuario(regExp);
            break;
        default:
            return resp.status(400).json({
                ok: true,
                mensaje: 'los tipos de busqueda solo son de usuario, veterinarios y centros veterinarios'
            });
    }
    resultado.then(data => {
        resp.status(200).json({
            ok: true,
            [tabla]: data
        });
    });
});

// busqueda global
app.get('/todo/:busqueda', (req, resp) => {

    let busqueda = req.params.busqueda;
    let regExp = new RegExp(busqueda, 'i');

    Promise.all([
            buscarCentrosVeterinarios(regExp),
            buscarVeterinarios(regExp),
            buscarUsuario(regExp)
        ])
        .then((respuestas) => {
            resp.status(200).json({
                ok: true,
                centrosVeterinarios: respuestas[0],
                veterinarios: respuestas[1],
                usuarios: respuestas[2]
            });
        });
});

function buscarCentrosVeterinarios(regExp) {

    return new Promise((resolve, reject) => {

        CentroVeterinario.find({ nombre: regExp })
            .populate(' usuario', 'nombre email')
            .exec((err, centrosVeterinarios) => {
                if (err) {
                    reject('error al cargar centros medicos');
                } else {
                    resolve(centrosVeterinarios)
                }
            });
    });
}

function buscarVeterinarios(regExp) {

    return new Promise((resolve, reject) => {

        veterinario.find({ nombre: regExp })
            .populate('usuario', 'nombre email')
            .populate('centroVeterinario')
            .exec((err, veterinarios) => {
                if (err) {
                    reject('error al cargar veterinarios');
                } else {
                    resolve(veterinarios)
                }
            });
    });
}

function buscarUsuario(regExp) {

    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre email role')
            .or([{ 'nombre': regExp }, { 'email': regExp }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('error al cargar usuarios');
                } else {
                    resolve(usuarios);
                }
            })
    });
}

module.exports = app;