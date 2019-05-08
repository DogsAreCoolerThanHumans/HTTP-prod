const express = require('express');
 
const app = express();
const PORT = process.env.PORT || 5000;
 
// Importar archivos api
const users = require('./api/users');
const products = require('./api/products');
 
// Inicalizar middelware, realiza lo mismo que el body-parser
app.use(express.json({extended: false}));

app.get('/', (req, res) => res.send('API Running'));
 
// Definir las rutas para los archivos api
app.use('/usuarios', users);
app.use('/producto', products); //sin s?
 
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));