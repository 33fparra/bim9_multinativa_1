var validator = require('validator')
var Paciente = require('../model/model')

var fs = require('fs')
var path = require('path')

var controllers = {

    //guardar nuevo paciente
    new: (req, res) =>{
        var params = req.body
        try{
            var rutVal = !validator.isEmpty(params.rut)
            var nombreVal = !validator.isEmpty(params.nombre)
            var edadVal = !validator.isEmpty(params.edad)
            var sexoVal = !validator.isEmpty(params.sexo)
            var enfermedadVal = !validator.isEmpty(params.enfermedad)
            // var emailVal = !validator.isEmpty(params.rut)
        }catch(err){
            return res.status(400).send({
                status: 'error',
                message: 'Not enough data'
            })
        }

        if(rutVal && nombreVal && edadVal && sexoVal && enfermedadVal){
            var paciente = new Paciente()
            paciente.rut = params.rut
            paciente.nombre = params.nombre
            paciente.edad = params.edad
            paciente.sexo = params.sexo
            paciente.enfermedad = params.enfermedad

            if(params.fotoPersonal){
                paciente.fotoPersonal = params.fotoPersonal
            }else{
                paciente.fotoPersonal = null
            }

            paciente.save((err, paciente)=>{
                if(err || !paciente){
                    return res.status(404).send({
                        status: 'error',
                        message: 'Impossible to save data in database'
                    })
                }

                return res.status(200).send({
                    status: 'success',
                    paciente
                })
            })
        }else{
            return res.status(400).send({
                status: 'error',
                message: 'Data is not valid'
            })
        }
    },

    //modificar
    update: (req, res) => {
        var id = req.params.id
        var params = req.body

        try{
            var rutVal = !validator.isEmpty(params.rut)
            var nombreVal = !validator.isEmpty(params.nombre)
            var edadVal = !validator.isEmpty(params.edad)
            var sexoVal = !validator.isEmpty(params.sexo)
            var enfermedadVal = !validator.isEmpty(params.enfermedad)
        }catch(err){
            return res.status(400).send({
                status: 'error',
                message: 'Not enough data'
            })
        }

        if(rutVal && nombreVal && edadVal && sexoVal && enfermedadVal){
            Paciente.findOneAndUpdate({_id:id}, params, {new:true}, (err, paciente)=>{
                if(err){
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error while updating'
                    })
                }

                if(!paciente){
                    return res.status(404).send({
                        status: 'error',
                        message: 'Paciente with id: '+id+' not exists'
                    })
                }

                return res.status(200).send({
                    status: 'success',
                    paciente
                })
            })
        }else{
            return res.status(400).send({
                status: 'error',
                message: 'Error while validating'
            })
        }
    },

    delete: (req, res) => {
        var id = req.params.id
        Paciente.findOneAndDelete({_id:id}, (err, paciente)=>{
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error while deleting'
                })
            }

            if(!paciente){
                return res.status(404).send({
                    status: 'error',
                    message: 'Paciente with id: '+id+' not found'
                })
            }

            return res.status(200).send({
                status: 'error',
                paciente
            })
        })
    },

    getUser: (req, res) =>{
        var id = req.params.id

        if(!id || id == null){
            return res.status(400).send({
                status: 'error',
                message: 'Document _id must be provided'
            })
        }

        Paciente.findById(id, (err, paciente) => {
            if(err || !paciente){
                return res.status(404).send({
                    status: 'error',
                    message: 'Paciente with id: '+id+' not found'
                })
            }

            return res.status(200).send({
                status: 'success',
                paciente
            })
        })
    },

    getUsers: (req, res) => {
        var query = Paciente.find({})
        var getLastUsers = req.params.last

        if(getLastUsers || getLastUsers != undefined){
            query.limit(5)
        }

        query.sort('-_id').exec((err, pacientes)=>{
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Internal server error'
                })
            }

            if(!pacientes){
                return res.status(404).send({
                    status: 'error',
                    message: 'No pacientes found in collection'
                })
            }

            return res.status(200).send({
                status: 'error',
                pacientes
            })
        })
    },

    //buscar fechaIngreo enfermedad sexo???? la fecha me genera dudas
    search: (req, res) => {
        var search = req.params.search

        Paciente.find({
            "$or":[
                // {"rut" : {"$regex": search, "$options":"i"}},
                // {"nombre": {"$regex" :search, "$options": "i"}}
                // {"edad" : {"$regex": search, "$options":"i"}},
                {"sexo": {"$regex" :search, "$options": "i"}},
                {"enfermedad" : {"$regex": search, "$options":"i"}},
                  ]
        })
        .sort([['fechaIngreso', 'descending']])
        .exec((err, pacientes)=>{
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error while looking for documents'
                })
            }

            if(!pacientes || pacientes.length<=0){
                return res.status(404).send({
                    status: 'error',
                    message: 'No pacientes found with: '+search+' criteria'
                })
            }

            return res.status(200).send({
                status: 'success',
                pacientes
            })
        })
    },

//tengo dudas con el filename debo cambiarlo? a tempFilenombre

    upload: (req, res) => {
        const file = req.file
        var id = req.params.id

        if(!file){
            return res.status(404).send({
                status: 'error',
                message: 'File cannot be empty or file ext is not allowed'
            })
        }

        var tempFilename = file.filename

        if(id){
            Paciente.findByIdAndUpdate({_id:id}, {fotoPersonal: tempFilename}, {new:true}, (err, paciente)=>{
                if(err || !paciente){
                    return res.status(400).send({
                        status: 'error',
                        message: 'Image could not be saved in document with _id: '+id
                    })
                }

                return res.status(200).send({
                    status: 'success',
                    message: 'File upload and paciente fotoPersonal updated successfully!',
                    filename: file.filename,
                    paciente: paciente
                })
            })
        }else{
            return res.status(200).send({
                status: 'error',
                message: 'File uploaded successfully',
                tempFilename
            })
        }
    },

    //obtener fotos
    getPhoto: (req, res) => {
        var file = req.params.filename
        var pathFile = 'uploads/' + file

        if(exists = fs.existsSync(pathFile)){
            return res.sendFile(path.resolve(pathFile))
        }else{
            return res.status(404).send({
                status: 'error',
                message: 'Image with image: '+ file + ' was not found'
            })
        }
    }
}

module.exports = controllers