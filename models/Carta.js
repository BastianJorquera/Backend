const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Carta', {
        id_carta: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nombre: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        rareza: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        tipo: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        id_franquicia: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        imagen_carta: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        id_api_externa: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        nombre_set: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        numero_carta: {
            type: DataTypes.TEXT,
            allowNull: true
        }

    }, {
        tableName: 'Carta',
        timestamps: false
    });
};