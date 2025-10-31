// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// 1. Importa la conexión desde config/database.js
const { connectDB } = require('./config/database'); 
// 2. Importa los modelos desde models
const { Usuario, Carta } = require('./models'); 

const app = express();
const PORT = process.env.PORT || 3000;

// --- AÑADIR ESTAS LÍNEAS ---
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes'); // <-- NUEVA LÍNEA

// Conectar a la base de datos
connectDB(); 

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.get('/', (req, res) => {
    res.send('¡Backend funcionando!');
});

// Tus otras rutas...
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); // <-- NUEVA LÍNEA

// Ejemplo de cómo usar un modelo en una ruta
app.get('/api/cartas', async (req, res) => {
    try {
        const cartas = await Carta.findAll(); 
        res.json(cartas);
    } catch (err) {
        res.status(500).send('Error en el servidor');
    }
});


app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});