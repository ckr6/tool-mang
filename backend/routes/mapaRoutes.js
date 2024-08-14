const express = require('express');
const { getMapaApartamentos } = require('../controllers/mapaController');

const router = express.Router();

router.get('/mapa-apartamentos', getMapaApartamentos);

module.exports = router;
