const jwt = require('jsonwebtoken');
const fs = require('fs');
 
const users = JSON.parse(fs.readFileSync('./data/usuarios.json')); // usuarios como archivo
const keys = JSON.parse(fs.readFileSync('./configuracion/keys.json')); //como doc
 
 
module.exports = (req, res, next) => {
    // Get token from header
    const token = req.header('x-auth');
    const xuser = req.header('x-user');
 
    // Verificar usuario
    if (!users.find(user => user.usuario === xuser)){
        res.status(406).json({msg: 'El usuario no existe'});
        return;
    }
 
    // Si no existe un token se rechaza la solicitud
    if (!token) {
        return res.status(401).json({msg: 'No token, authorization denied'});
    }
 
    // Verificar token
    try {
        if(jwt.verify(token, keys.jwtSecret)){
            next();
        }
    } catch (e) {
        res.status(401).json({msg: 'Token is not valid'});
    }
};