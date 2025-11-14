const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // Para encriptar contraseñas
const jwt = require('jsonwebtoken'); // Para generar tokens
const { Usuario } = require('../models'); // Importamos el modelo Usuario desde models/index.js

// --- RUTA DE REGISTRO (SignUp) ---
// POST /api/auth/register
router.post('/register', async (req, res) => {
    // Obtenemos los datos del cuerpo de la petición
    const { nombre_usuario, correo, telefono, contraseña, tipo_usuario, foto_perfil } = req.body;

    try {
        // 1. Verificar si el correo ya existe
        let user = await Usuario.findOne({ where: { correo: correo } });
        if (user) {
            return res.status(400).json({ msg: 'El correo ya está registrado' });
        }

        // 2. Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(contraseña, salt);

        // 3. Crear el nuevo usuario en la base de datos
        user = await Usuario.create({
            nombre_usuario: nombre_usuario,
            correo: correo,
            telefono: telefono,
            contraseña: hashedPassword, // Guardamos la contraseña encriptada
            tipo_usuario: tipo_usuario || 'comprador', // Si no se especifica, es 'comprador'
            fecha_registro: new Date(), // Usamos la fecha actual
            foto_perfil: foto_perfil || null
        });

        // 4. Crear el Payload para el JWT (la info que guardará el token)
        const payload = {
            user: {
                id: user.id_usuario // Usamos el id_usuario de tu modelo
            }
        };

        // 5. Firmar y devolver el token
        jwt.sign(
            payload,
            process.env.SECRET_KEY_JWT, // Tu clave secreta del archivo .env
            { expiresIn: '1h' }, // El token expira en 1 hora
            (err, token) => {
                if (err) throw err;
                res.status(201).json({ token }); // Devolvemos el token
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error en el servidor');
    }
});

// --- RUTA DE INICIO DE SESIÓN (Login) ---
// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { correo, contraseña } = req.body;

    try {
        // 1. Verificar si el usuario existe
        let user = await Usuario.findOne({ where: { correo: correo } });
        if (!user) {
            return res.status(400).json({ msg: 'Credenciales inválidas' });
        }

        // 2. Comparar la contraseña ingresada con la encriptada en la BD
        const isMatch = await bcrypt.compare(contraseña, user.contraseña);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Credenciales inválidas' });
        }

        // 3. Si todo coincide, crear y firmar el token
        const payload = {
            user: {
                id: user.id_usuario
            }
        };

        jwt.sign(
            payload,
            process.env.SECRET_KEY_JWT,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error en el servidor');
    }
});

module.exports = router;