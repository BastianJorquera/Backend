// config/database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        logging: false, // Puedes establecer a true para ver las consultas SQL en la consola
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida correctamente.');
        // Opcional: sincronizar modelos (crea las tablas si no existen)
        // await sequelize.sync({ force: false }); // 'force: true' borra y recrea las tablas
        // console.log('Modelos sincronizados con la base de datos.');
    } catch (error) {
        console.error('No se pudo conectar a la base de datos:', error);
        process.exit(1); // Salir del proceso si no se puede conectar
    }
};

module.exports = { sequelize, connectDB };