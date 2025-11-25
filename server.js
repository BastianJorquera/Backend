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
const userRoutes = require('./routes/user.routes');
const publicacionesRoutes = require('./routes/publicaciones.routes');
const cartasRoutes = require('./routes/cartas.routes');

// Conectar a la base de datos
connectDB(); 

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.get('/', (req, res) => {
    res.send('¡Backend funcionando!');
});

// Otras rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/publicaciones', publicacionesRoutes);
app.use('/api/cartas', cartasRoutes);


app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});