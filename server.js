const express = require('express');
 
const app = express();
const PORT = process.env.PORT || 5000;
 
// Archivos api
const users = require('./api/users');
const products = require('./api/products');
 
// Middelware como en body-parser
app.use(express.json({extended: false}));

app.get('/', (req, res) => res.send('API Running'));
 
// Rutas para los archivos api
app.use('/usuarios', users); //como en proyecto Node del profesor 
app.use('/producto', products); //sin s?
 
app.listen(PORT, () => console.log(`Server started on port ${PORT}`)); 