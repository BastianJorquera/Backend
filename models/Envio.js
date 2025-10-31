const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Envio', {
        id_envio: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        id_transaccion: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        direccion_envio: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        estado_envio: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        fecha_envio: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        fecha_entrega_estimada: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        fecha_entrega_real: {
            type: DataTypes.DATEONLY,
            allowNull: false
        }
    }, {
        tableName: 'Envio',
        timestamps: false
    });
};