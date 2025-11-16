const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // 1. Importamos el "guardia"
const { Usuario } = require('../models'); // Importamos el modelo de Usuario
const bcrypt = require('bcryptjs');

// --- RUTA PARA OBTENER EL PERFIL DEL USUARIO ---
// GET /api/users/me
// Nota cómo pasamos 'authMiddleware' como segundo argumento.
// Express lo ejecutará ANTES de la función async (req, res).
router.get('/me', authMiddleware, async (req, res) => {
    try {
        // 2. Gracias al middleware, ahora tenemos 'req.user.id'
        // 'req.user.id' contiene el 'id_usuario' que guardamos en el token
        const user = await Usuario.findByPk(req.user.id, {
            // Excluimos la contraseña del objeto que devolvemos
            attributes: { exclude: ['contraseña'] } 
        });

        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }
        
        res.json(user); // Devolvemos los datos del usuario (sin contraseña)

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error en el servidor');
    }
});

// --- RUTA PARA ACTUALIZAR EL PERFIL DEL USUARIO ---
// PUT /api/users/me
router.put('/me', authMiddleware, async (req, res) => {
  try {
    console.log('Datos recibidos para actualización:', req.body);
    const user = await Usuario.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    // Solo permitimos actualizar ciertos campos
    //AGREGAR CAMPOS SEGUN MODELO USUARIO
    const { nombre_usuario, correo, telefono, foto_perfil } = req.body;

    if (nombre_usuario) user.nombre_usuario = nombre_usuario;
    if (correo) user.correo = correo;
    if (telefono) user.telefono = telefono;
    if (foto_perfil) user.foto_perfil = foto_perfil;

    await user.save();

    // Retornamos el nuevo usuario sin contraseña
    res.json({
      msg: 'Perfil actualizado correctamente',
      user: {
        id_usuario: user.id_usuario,
        nombre_usuario: user.nombre_usuario,
        correo: user.correo,
        telefono: user.telefono,
        foto_perfil: user.foto_perfil
      }
    });

  } catch (err) {
    console.error('Error al actualizar perfil:', err);
    res.status(500).send('Error en el servidor');
  }
});

// --- RUTA PARA ELIMINAR EL PERFIL DEL USUARIO ---
// DELETE /api/users/me
router.delete('/me', authMiddleware, async (req, res) => {
    try{
        const user = await Usuario.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }
        await user.destroy();
        res.json({ msg: 'Usuario eliminado correctamente' });

    } catch (err) {
        console.error('Error al eliminar usuario:', err);
        res.status(500).send('Error en el servidor');
    }
});

// --- RUTA PARA CAMBIAR CONTRASEÑA ---
// PUT /api/users/change-password
router.put('/change-password', authMiddleware, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ msg: 'Debe enviar la contraseña actual y la nueva.' });
    }

    // Buscar usuario por el id que viene del token (authMiddleware)
    const user = await Usuario.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    // Verificar contraseña actual
    const passwordMatch = await bcrypt.compare(oldPassword, user.contraseña);
    if (!passwordMatch) {
      return res.status(400).json({ msg: 'La contraseña actual no es correcta.' });
    }

    // Hashear nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.contraseña = hashedPassword;
    await user.save();

    res.json({ msg: 'Contraseña actualizada correctamente.' });
  } catch (err) {
    console.error('Error al cambiar contraseña:', err);
    res.status(500).send('Error en el servidor');
  }
});

module.exports = router;