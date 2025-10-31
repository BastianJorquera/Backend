const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Franquicia', {
        id_franquicia: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nombre: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        descripcion: {
            type: DataTypes.TEXT,
            defaultValue: 'SIN DESCRIPCION'
        },
        imagen: {
            type: DataTypes.TEXT
        }
    }, {
        tableName: 'Franquicia',
        timestamps: false
    });
};