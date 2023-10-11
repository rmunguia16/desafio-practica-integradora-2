import { Router } from 'express';
import express from 'express';
import path from 'path';
import __dirname from "../utils.js";
import { productModel } from '../models/products.models.js';

const app = express();
const router = Router();

router.get('/', async (req, res) => {
    let { limit } = req.query;
    try {
        const products = await productModel.find().limit(parseInt(limit)).lean();
        console.log(typeof(products));
        console.log(products);
        res.render("realTimeProducts", {
            logged: true,
            products: products,
            rutaJs: "realTimeProducts",
            rutaCss: "realTimeProducts",
            logout: "../api/session/logout"
        });
    } catch (error) { res.status(400).send({ error: `Error al consultar productos: ${error.message}` }); }
});

router.get('/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        const product = await productModel.findById(pid).lean();
        res.send(product ? product : { error: `No se encontró el producto ${pid}`});
    } catch (error) { res.status(400).send({ error: `Error al consultar productos: ${error.message}` }); }
});

router.post('/', async (req, res) => {
    const { title, description, stock, code, price, category } = req.body;
    try {
        const product = await productModel.create({
            title, description, stock, code, price, category
        });
        res.status(200).send({ resultado: 'OK', message: product })
    } catch (error) {
        res.status(400).send({ error: `Error al crear el producto ${pid}: ${error.message}` });
    }
});



router.put('/:pid', async(req, res) => {
    const { pid } = req.params;
    const { title, description, stock, code, price, category } = req.body;
    try {
        const respuesta = await productModel.findByIdAndUpdate(pid, {
            title, description, stock, code, price, category
        });
        respuesta ? res.status(200).send({ resultado: 'OK', message: respuesta }) : res.status(404).send({ error: `No se encontró el producto ${pid}` });
    } catch (error) {
        res.status(400).send({ error: `Error al actualizar el producto ${pid}: ${error.message}` });
    }
});



router.delete('/:pid', async(req, res) => {
    const { pid } = req.params;
    try {
        const respuesta = productModel.findByIdAndDelete(pid);
        respuesta ? res.status(200).send({ resultado: 'OK', message: respuesta }) : res.status(404).send({ error: `No se encontró el producto ${pid}` });
    } catch (error) {
        res.status(400).send({ error: `Error al borrar el producto ${pid}: ${error.message}` });
    }
});

/*io.on('connection', (socket) => {
    console.log('Un cliente se ha conectado');
    socket.on('newProduct', (product) => {
        socket.emit('agregar',pm.addProduct(product));
    });
});*/

let io = app.get('io')
console.log(app.get('views'));
console.log(io);
/* io.on('connection', (socket) => {
    console.log('Un cliente se ha conectado');
    socket.on('newProduct', (product) => {
        console.log(product);
        socket.emit('agregar', pm.addProduct(product));
    });
});
console.log(io); */

export default router;