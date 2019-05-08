const jwt = require('jsonwebtoken');
const fs = require('fs');
 
const users = JSON.parse(fs.readFileSync('./data/usuarios.json')); // archivo/base de usuarios
const keys = JSON.parse(fs.readFileSync('./configuracion/keys.json')); //como doc
 
 
module.exports = (req, res, next) => {
    const token = req.header('x-auth'); //headers para token
    const xuser = req.header('x-user'); //headers para usuario en uso
 
    if (!users.find(user => user.usuario === xuser)){ //si usuario no es correcto
        res.status(406).json({msg: 'Usuario no existe'}); //msje de error
        return;
    }
 
    if (!token) { //rechaza solicitud sin token
        return res.status(401).json({msg: 'Sin token'});
    }
 
    try { //si token sigue activo
        if(jwt.verify(token, keys.jwtSecret)){
            next();
        }
    } catch (e) {
        res.status(401).json({msg: 'Token inválido'});
    }
};