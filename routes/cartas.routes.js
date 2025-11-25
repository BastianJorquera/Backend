const express = require('express');
const router = express.Router();
const { Carta } = require('../models');
const { Op } = require('sequelize');

// GET /api/cartas - obtener todas las cartas
router.get('/', async (req, res) => {
  try {
    const cartas = await Carta.findAll();
    res.json(cartas);
  } catch (err) {
    console.error('Error al obtener cartas:', err);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
});

// GET /api/cartas/search?nombre=pi&franquicia=1
router.get('/search', async (req, res) => {
  try {
    const { nombre, franquicia } = req.query;

    const where = {};

    if (nombre) {
      // ILIKE para búsqueda case-insensitive
      where.nombre = { [Op.iLike]: `%${nombre}%` };
    }

    if (franquicia) {
      where.id_franquicia = franquicia;
    }

    const cartas = await Carta.findAll({ where });
    res.json(cartas);
  } catch (err) {
    console.error('Error en búsqueda de cartas:', err);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
});

// GET /api/cartas/:id - obtener carta por id
router.get('/:id_carta', async (req, res) => {
  try {
    const { id_carta } = req.params;
    const carta = await Carta.findByPk(id_carta);

    if (!carta) {
      return res.status(404).json({ msg: 'Carta no encontrada' });
    }

    res.json(carta);
  } catch (err) {
    console.error('Error al obtener carta:', err);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
});

// POST /api/cartas - crear una carta
router.post('/', async (req, res) => {
  try {
    const {
      nombre,
      rareza,
      tipo,
      id_franquicia,
      imagen_carta,
      id_api_externa,
      nombre_set,
      numero_carta
    } = req.body;

    // Validaciones básicas
    if (!nombre || !rareza || !tipo || !id_franquicia || !imagen_carta) {
      return res.status(400).json({ msg: 'Faltan campos obligatorios' });
    }

    const nuevaCarta = await Carta.create({
      nombre,
      rareza,
      tipo,
      id_franquicia,
      imagen_carta,
      id_api_externa: id_api_externa || null,
      nombre_set: nombre_set || null,
      numero_carta: numero_carta || null
    });

    res.status(201).json(nuevaCarta);
  } catch (err) {
    console.error('Error al crear carta:', err);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
});

// PUT /api/cartas/:id_carta - actualizar una carta
router.put('/:id_carta', async (req, res) => {
  try {
    const { id_carta } = req.params;

    const carta = await Carta.findByPk(id_carta);
    if (!carta) {
      return res.status(404).json({ msg: 'Carta no encontrada' });
    }

    const {
      nombre,
      rareza,
      tipo,
      id_franquicia,
      imagen_carta,
      id_api_externa,
      nombre_set,
      numero_carta
    } = req.body;

    await carta.update({
      nombre: nombre ?? carta.nombre,
      rareza: rareza ?? carta.rareza,
      tipo: tipo ?? carta.tipo,
      id_franquicia: id_franquicia ?? carta.id_franquicia,
      imagen_carta: imagen_carta ?? carta.imagen_carta,
      id_api_externa: id_api_externa ?? carta.id_api_externa,
      nombre_set: nombre_set ?? carta.nombre_set,
      numero_carta: numero_carta ?? carta.numero_carta
    });

    res.json(carta);
  } catch (err) {
    console.error('Error al actualizar carta:', err);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
});

// DELETE /api/cartas/:id_carta - eliminar carta
router.delete('/:id_carta', async (req, res) => {
  try {
    const { id_carta } = req.params;

    const carta = await Carta.findByPk(id_carta);
    if (!carta) {
      return res.status(404).json({ msg: 'Carta no encontrada' });
    }

    await carta.destroy();
    res.json({ msg: 'Carta eliminada correctamente' });
  } catch (err) {
    console.error('Error al eliminar carta:', err);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
});



module.exports = router;
