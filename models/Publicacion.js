const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Publicacion', {
        id_publicacion: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        id_usuario: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_carta: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true
        },
        precio: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        cantidad: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        estado: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        fecha_publicacion: {
            type: DataTypes.DATEONLY,
            allowNull: false
        }
    }, {
        tableName: 'Publicacion',
        timestamps: false
    });
};