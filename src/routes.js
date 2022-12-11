var express = require('express')
var controller = require('./controller/controller')
var upload = require('./config/multer_config')
var router = express.Router()

router.get('/', (req, res)=>{return res.send('ruta de prueba')})

router.post('/paciente', controller.new)
router.get('/pacientes/:last?', controller.getUsers)
router.get('/paciente/:id', controller.getUser)
router.put('/paciente/:id', controller.update)
router.delete('/paciente/:id', controller.delete)
router.get('/paciente/search/:search', controller.search)

router.post('/paciente/foto/:id?', upload, controller.upload)
router.get('/paciente/foto/:filename', controller.getPhoto)

module.exports = router