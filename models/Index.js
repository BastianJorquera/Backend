const { sequelize } = require('../config/database'); // 1. Importa la conexión
const { DataTypes } = require('sequelize');

// 2. Define e importa todos los modelos
// Sequelize necesita que le pases la instancia 'sequelize' y 'DataTypes'
const defineUsuario = require('./Usuario');
const defineFranquicia = require('./Franquicia');
const defineCarta = require('./Carta');
const definePublicacion = require('./Publicacion');
const defineTransaccion = require('./Transaccion');
const defineEnvio = require('./Envio');
const defineValoracion = require('./Valoracion');
const defineCarrito = require('./Carrito');

const Usuario = defineUsuario(sequelize, DataTypes);
const Franquicia = defineFranquicia(sequelize, DataTypes);
const Carta = defineCarta(sequelize, DataTypes);
const Publicacion = definePublicacion(sequelize, DataTypes);
const Transaccion = defineTransaccion(sequelize, DataTypes);
const Envio = defineEnvio(sequelize, DataTypes);
const Valoracion = defineValoracion(sequelize, DataTypes);
const Carrito = defineCarrito(sequelize, DataTypes);

// 3. Crea las asociaciones (tus 'ALTER TABLE')
// Relación Carta <-> Franquicia
Franquicia.hasMany(Carta, { foreignKey: 'id_franquicia' });
Carta.belongsTo(Franquicia, { foreignKey: 'id_franquicia' });

// Relación Publicacion <-> Usuario (Vendedor)
Usuario.hasMany(Publicacion, { foreignKey: 'id_usuario', as: 'Publicaciones' });
Publicacion.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });

// Relación Publicacion <-> Carta (es 1-a-1 porque 'id_carta' es UNIQUE)
Carta.hasOne(Publicacion, { foreignKey: 'id_carta', as: 'publicacion' });
Publicacion.belongsTo(Carta, { foreignKey: 'id_carta', as: 'carta' });

// Relación Transaccion <-> Publicacion
Publicacion.hasMany(Transaccion, { foreignKey: 'id_publicacion' });
Transaccion.belongsTo(Publicacion, { foreignKey: 'id_publicacion' });

// Relación Transaccion <-> Usuario (Comprador)
Usuario.hasMany(Transaccion, { foreignKey: 'id_comprador', as: 'Compras' });
Transaccion.belongsTo(Usuario, { foreignKey: 'id_comprador', as: 'Comprador' });

// Relación Envio <-> Transaccion (asumo 1-a-1)
Transaccion.hasOne(Envio, { foreignKey: 'id_transaccion' });
Envio.belongsTo(Transaccion, { foreignKey: 'id_transaccion' });

// Relación Valoracion <-> Transaccion (1-a-1 por UNIQUE)
Transaccion.hasOne(Valoracion, { foreignKey: 'id_transaccion' });
Valoracion.belongsTo(Transaccion, { foreignKey: 'id_transaccion' });

// Relación Valoracion <-> Usuario (Vendedor) (1-a-1 por UNIQUE)
Usuario.hasOne(Valoracion, { foreignKey: 'id_vendedor', as: 'ValoracionRecibida' });
Valoracion.belongsTo(Usuario, { foreignKey: 'id_vendedor', as: 'Vendedor' });

// Relación Valoracion <-> Usuario (Comprador) (1-a-1 por UNIQUE)
Usuario.hasOne(Valoracion, { foreignKey: 'id_comprador', as: 'ValoracionHecha' });
Valoracion.belongsTo(Usuario, { foreignKey: 'id_comprador', as: 'Comprador' });

// Relación Carrito <-> Usuario
Usuario.hasMany(Carrito, { foreignKey: 'id_usuario' });
Carrito.belongsTo(Usuario, { foreignKey: 'id_usuario' });

// Relación Carrito <-> Publicacion
Publicacion.hasMany(Carrito, { foreignKey: 'id_publicacion' });
Carrito.belongsTo(Publicacion, { foreignKey: 'id_publicacion' });


// 4. Exporta todo
module.exports = {
    sequelize,
    Usuario,
    Franquicia,
    Carta,
    Publicacion,
    Transaccion,
    Envio,
    Valoracion,
    Carrito
};