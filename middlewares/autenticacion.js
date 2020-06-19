const SEED = require('../config/config').SEED;
const jwt = require('jsonwebtoken');

// verificar token
exports.verificaToken = (req, resp, next) => {

    let token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {

        if (err) {
            return resp.status(401).json({
                ok: false,
                mensaje: 'token incorrecto',
                errors: err
            });
        }
        req.usuario = decoded.usuario;
        next();
    });
}