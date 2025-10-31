const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Valoracion', {
        id_valoracion: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        id_vendedor: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true
        },
        id_comprador: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true
        },
        id_transaccion: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true
        },
        puntuacion: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        comentario: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        fecha_valoracion: {
            type: DataTypes.DATEONLY,
            allowNull: false
        }
    }, {
        tableName: 'Valoracion',
        timestamps: false
    });
};