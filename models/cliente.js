var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var clienteSchema = new Schema({
    nombre: { type: String, required: [true, 'El	nombre	es	necesario'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    centroVeterinario: {
        type: Schema.Types.ObjectId,
        ref: 'CentroVeterinario',
        required: [true, 'El id del centro Centro Veterinario es un campo obligatorio']
    },
    mascota: {
        type: Schema.Types.ObjectId,
        ref: 'Mascota'
    }
});
module.exports = mongoose.model('Cliente', clienteSchema);