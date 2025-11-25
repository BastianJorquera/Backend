const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware.js');
const { Publicacion, Carta, Usuario } = require('../models');

// =========================
// 1) Crear publicación
// POST /api/publicaciones
// =========================
router.post('/', auth, async (req, res) => {
  try {
    const { id_carta, precio, cantidad, estado } = req.body;

    if (!id_carta || !precio || !cantidad) {
      return res.status(400).json({
        msg: 'id_carta, precio y cantidad son obligatorios'
      });
    }

    const nueva = await Publicacion.create({
      id_usuario: req.user.id,         // viene del token
      id_carta,
      precio,
      cantidad,
      estado: estado || '',            // observación libre
      fecha_publicacion: new Date()    // hoy
    });

    res.status(201).json(nueva);
  } catch (err) {
    console.error('Error al crear publicación:', err);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
});

// =======================================
// 2) Listar TODAS las publicaciones
// GET /api/publicaciones
// =======================================
router.get('/', async (req, res) => {
  try {
    const publicaciones = await Publicacion.findAll({
      include: [
        {
          model: Carta,
          as: 'carta'
        },
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['id_usuario', 'nombre_usuario']
        }
      ],
      order: [['fecha_publicacion', 'DESC']]
    });

    res.json(publicaciones);
  } catch (err) {
    console.error('Error al listar publicaciones:', err);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
});

// ========================================
// 3) Listar publicaciones del usuario logueado
// GET /api/publicaciones/mias
// ========================================
router.get('/mias', auth, async (req, res) => {
  try {
    const idUsuario = req.user.id;

    const publicaciones = await Publicacion.findAll({
      where: { id_usuario: idUsuario },
      include: [
        {
          model: Carta,
          as: 'carta'
        }
      ],
      order: [['fecha_publicacion', 'DESC']]
    });

    res.json(publicaciones);
  } catch (err) {
    console.error('Error al listar publicaciones del usuario:', err);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
});

// ========================================
// 4) Obtener detalle de una publicación
// GET /api/publicaciones/:id
// ========================================
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const pub = await Publicacion.findByPk(id, {
      include: [
        { model: Carta, as: 'carta' },
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['id_usuario', 'nombre_usuario']
        }
      ]
    });

    if (!pub) {
      return res.status(404).json({ msg: 'Publicación no encontrada' });
    }

    res.json(pub);
  } catch (err) {
    console.error('Error al obtener publicación:', err);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
});

// ========================================
// 5) Actualizar publicación
// PUT /api/publicaciones/:id
// Solo el dueño puede editar
// ========================================
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { precio, cantidad, estado } = req.body;
    const idUsuario = req.user.id;

    const pub = await Publicacion.findByPk(id);

    if (!pub) {
      return res.status(404).json({ msg: 'Publicación no encontrada' });
    }

    if (pub.id_usuario !== idUsuario) {
      return res.status(403).json({ msg: 'No tienes permiso para editar esta publicación' });
    }

    if (precio !== undefined) pub.precio = precio;
    if (cantidad !== undefined) pub.cantidad = cantidad;
    if (estado !== undefined) pub.estado = estado;

    await pub.save();

    res.json(pub);
  } catch (err) {
    console.error('Error al actualizar publicación:', err);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
});

// ========================================
// 6) Eliminar publicación
// DELETE /api/publicaciones/:id
// Solo el dueño
// ========================================
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const idUsuario = req.user.id;

    const pub = await Publicacion.findByPk(id);

    if (!pub) {
      return res.status(404).json({ msg: 'Publicación no encontrada' });
    }

    if (pub.id_usuario !== idUsuario) {
      return res.status(403).json({ msg: 'No tienes permiso para eliminar esta publicación' });
    }

    await pub.destroy();

    res.json({ msg: 'Publicación eliminada' });
  } catch (err) {
    console.error('Error al eliminar publicación:', err);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
});

module.exports = router;
