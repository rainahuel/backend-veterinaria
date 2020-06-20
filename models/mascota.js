var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var mascotaSchema = new Schema({
    nombre: { type: String, required: [true, 'El	nombre	es	necesario'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    cliente: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'cliente',
        required: [true, 'El id del cliente es un campo obligatorio']
    },
    centroVeterinario: {
        type: Schema.Types.ObjectId,
        ref: 'CentroVeterinario',
        required: [true, 'El id del Centro Veterinario es un campo obligatorio']
    }
});
module.exports = mongoose.model('Mascota', mascotaSchema);