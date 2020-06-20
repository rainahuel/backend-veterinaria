const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const app = express();
app.use(fileUpload());
const Usuario = require('../models/usuario')
const CentroVeterinario = require('../models/centroVeterinario')
const Veterinario = require('../models/veterinario')
const Mascota = require('../models/usuario')
const Cliente = require('../models/cliente')



app.put('/:tipo/:id', (req, resp, next) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    //tipos de colecciones
    let tiposValidos = ['veterinarios', 'centrosMedicos', 'usuarios',
        'clientes', 'mascotas'
    ];

    if (tiposValidos.indexOf(tipo) < 0) {
        return resp.status(400).json({
            ok: false,
            mensaje: 'el tipo de coleccion no es valido',
            errors: { message: ' el tipo de coleccion no es valido' }
        });
    }

    if (!req.files) {
        return resp.status(400).json({
            ok: false,
            mensaje: 'no se selecciono nada',
            errors: { message: ' debe seleccionar una imagen' }
        });
    }

    //obtener nombre del archivo
    let archivo = req.files.imagen;
    let nombreCortado = archivo.name.split('.');
    let extencion = nombreCortado[nombreCortado.length - 1];

    // validacion de extenciones
    let extencionesPermitidas = ['npg', 'jpg', 'gif', 'jpeg'];
    if (extencionesPermitidas.indexOf(extencion) < 0) {
        return resp.status(400).json({
            ok: false,
            mensaje: 'extencion no valida',
            errors: { message: ' las extenciones validas son: ' + extencionesPermitidas.join(', ') }
        });
    }
    // nombre archivo personalizado
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extencion}`;

    // mover archivo temporal carpeta
    let path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv(path, err => {
        if (err) {
            return resp.status(500).json({
                ok: false,
                mensaje: 'error al movel archivo',
                errors: err
            });
        }
        subirPorTipos(tipo, id, nombreArchivo, resp);
    });
});

function subirPorTipos(tipo, id, nombreArchivo, resp) {

    switch (tipo) {
        case 'veterinarios':

            break;
        case 'usuarios':
            Usuario.findById(id, (err, usuario) => {

                if (!usuario) {
                    return resp.status(400).json({
                        ok: false,
                        mensaje: 'Usuario no existe',
                        errors: { message: 'usuario no existe' }
                    });
                }
                let pathViejo = './uploads/usuarios/' + usuario.img;
                if (fs.existsSync(pathViejo)) {
                    fs.unlink(pathViejo, (err) => {
                        if (err) {
                            return resp.status(500).json({
                                ok: false,
                                mensaje: 'error al eliminar archivo existente',
                                errors: err
                            });
                        }
                    });
                }
                usuario.img = nombreArchivo;
                usuario.save((err, usuarioActualizado) => {
                    if (err) {
                        return resp.status(500).json({
                            ok: false,
                            mensaje: 'error guardar el archivo',
                            errors: err
                        });
                    }
                    return resp.status(200).json({
                        ok: true,
                        mensaje: 'imagen de usuario actualizada',
                        usuarioActualizado
                    });
                });
            });
            break;
        case 'centrosVeterinarios':

            break;
        default:
            break;
    }

}

module.exports = app;