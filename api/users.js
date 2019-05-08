const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const fs = require('fs');
const auth = require('../middleware/autenticacion');

const users = JSON.parse(fs.readFileSync('./data/usuarios.json'));
const keys = JSON.parse(fs.readFileSync('./configuracion/keys.json'));

router.post('/login', (req, res) => { //post para loguear user
    const {usuario, contraseña} = req.body; //valores a logear (dados en entrada de p/e Postman)

    try {
        if (!users.find(user => {
            return user.contraseña === contraseña && user.usuario === usuario //verifica user y pass (como en json)
        })) {
            return res.status(400).json({errors: [{msg: 'Usuario/contraseña no existen'}]}); //msje de error devuelto
        }

        console.log('Sesión iniciada (debugging)'); //para pruebas
        const payload = {
        };

        jwt.sign( //desde web token
            payload,
            keys.jwtSecret,
            {expiresIn: 300}, //expiración fija
            (err, token) => {
                if (err) throw err;
                res.json({token});
            });

    } catch (e) {
        console.error(e.message);
        res.status(500).send('Error en servidor');
    }
});

router.post('/logout', auth, (req, res) => { //termina sesión según usuario especificado 
    const newToken = {
        "jwtSecret": makeid(50)
    };
    fs.writeFileSync('./configuracion/keys.json', JSON.stringify(newToken));
    res.status(200).send('User logged out');
});

function makeid(length) { //generador de ids dados parámetros/rangos
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


module.exports = router;