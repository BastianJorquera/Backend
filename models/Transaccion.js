const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Transaccion', {
        id_transaccion: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        id_publicacion: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_comprador: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        cantidad: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        total: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        fecha_transaccion: {
            type: DataTypes.DATE, // DATE es para 'timestamp with time zone'
            allowNull: false
        },
        metodo_de_pago: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {
        tableName: 'Transaccion',
        timestamps: false
    });
};