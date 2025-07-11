const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/criar', userController.criarUsuario);
router.post('/resultado', userController.adicionarResultado);
router.get('/historico/:id', userController.buscarHistorico);

module.exports = router;