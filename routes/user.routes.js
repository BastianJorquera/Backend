const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // 1. Importamos el "guardia"
const { Usuario } = require('../models'); // Importamos el modelo de Usuario

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

module.exports = router;