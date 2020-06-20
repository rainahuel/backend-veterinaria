const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();


app.get('/:tipo/:img', (req, resp, next) => {

    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImagen = path.resolve(__dirname, `../uploads/${tipo}/${img}`);
    if (fs.existsSync(pathImagen)) {
        resp.sendFile(pathImagen);
    } else {
        let pathNoImage = path.resolve(__dirname, '../assets/no-img.jpg');
        resp.sendFile(pathNoImage);
    }
});

module.exports = app;