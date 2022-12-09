var mongoose = require('mongoose')
var Schema = mongoose.Schema

var pacienteSchema = Schema({
    rut: String,
    nombre: String,
    edad: {type: Number}, //aca me quedo la duda porque en stackoverflow me sale asi pero yo lo hacia con un int solo
    sexo: String,
    fotoPersonal: String,
    fechaIngreso: {type: Date, default: Date.now},
    enfermedad: String,
    revisado: {type: Boolean, default: false}
})

module.exports = mongoose.model('Paciente', pacienteSchema)