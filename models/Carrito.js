const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Carrito', {
        id_carrito: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        id_usuario: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_publicacion: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        cantidad: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'Carrito',
        timestamps: false
    });
};