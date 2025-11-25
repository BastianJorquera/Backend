const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Usuario', {
        id_usuario: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nombre_usuario: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        correo: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: true
        },
        telefono: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        contraseña: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        tipo_usuario: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        fecha_registro: {
            type: DataTypes.DATEONLY, // DATEONLY es para 'date' sin hora
            allowNull: false
        },
        foto_perfil: {
            type: DataTypes.TEXT,
            allowNull: true
        }

    }, {
        tableName: 'Usuario', // Forza el nombre exacto de la tabla
        timestamps: false     // No crea createdAt/updatedAt
    });
};