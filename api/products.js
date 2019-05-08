const express = require('express');
const router = express.Router();
const fs = require('fs');
const auth = require('../middleware/autenticacion');

const products = JSON.parse(fs.readFileSync('./data/productos.json'));

router.get('/', (req, res) => { //get a lista de productos por marca/raza
    const {marca} = req.body;

    if (marca) {
        const filtrado = products.filter(pr => pr.marca === marca); //marca: nombrado según objeto/json
        res.json(filtrado);
    } else {
        res.json(products);
    }
});

router.post('/', auth, (req, res) => { //post a json de productos, genera id (no necesario especificar)
    const {
        nombre,
        precio,
        marca,
        descripcion,
        existencia
    } = req.body; //forma body con la entrada 

    req.body.id = products.length;

    if (nombre && precio && marca && descripcion && existencia >= 0) {
        products.push(req.body);
        fs.writeFileSync('./data/productos.json', JSON.stringify(products)); 
        res.status(201).send(req.body); //introduce el body en el archivo json como nuevo objeto

        console.log("modificado (debugging)"); //msje en consola para mis pruebas 
        return;
    }

    console.log("no modificado (debugging)"); //para probar cuando falla
    res.status(400).send({
       error: "Faltan atributos en el body"});
});

router.get('/:id', (req, res) => { //get a perrito específico (según /id)
    const {id} = req.params; //intro por el usuario
    const product = products.find(pr => pr.id == id);

    if (product) {
        res.json(product);
        return;
    }

    res.json({error: "Perrito no existe"});
});

router.patch('/:id', auth, (req, res) => { //modifica perrito de id especificado
    const {id} = req.params; //intro por el usuario
    const product = req.body;

    if (updateProduct(id, product)) { //llama a función (abajo) para verificar
        res.json(product);
    } else {
        res.status(400).send({ 
            error: "Invalid ID" })
    }
});

// Actualizar producto
const updateProduct = (id, producto) => {
    let pos = products.findIndex(pr => pr.id == id); //busca el id especificado en json

    if (pos >= 0) {
        products[pos].nombre = (producto.nombre) ? producto.nombre : products[pos].nombre;
        products[pos].marca = (producto.marca) ? producto.marca : products[pos].marca;
        products[pos].descripcion = (producto.descripcion) ? producto.descripcion: products[pos].descripcion;
        products[pos].precio = (producto.precio) ? (producto.precio >= 0 ? producto.precio : products[pos].precio) : products[pos].precio;
        products[pos].existencia = (producto.existencia) ? (producto.existencia >= 0 ? producto.existencia : products[pos].existencia) : productos[pos].existencia;

        fs.writeFileSync('./data/productos.json', JSON.stringify(products)); //escribe nueva entrada
        return true;
    } else{
        return false;
    }
};

module.exports = router;
