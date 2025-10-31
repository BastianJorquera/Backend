const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // 1. Obtener el token del header de la petición
    // Usaremos 'x-auth-token' como el nombre del header
    const token = req.header('x-auth-token');

    // 2. Si no hay token, denegar acceso
    if (!token) {
        return res.status(401).json({ msg: 'No hay token, autorización denegada' });
    }

    // 3. Si hay token, verificarlo
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);
        
        // 4. Si es válido, adjuntamos los datos del usuario (el payload) 
        // a la petición (req) para que la siguiente función la use.
        req.user = decoded.user;
        next(); // ¡Importante! Llama a next() para pasar al siguiente middleware o ruta
    } catch (err) {
        res.status(401).json({ msg: 'Token no es válido' });
    }
};