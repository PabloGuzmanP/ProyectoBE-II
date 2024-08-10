import { Router } from "express";
import CartsManager from "../../managers/CartsManager.js";
import { checkAuth } from "../../middlewares/auth.middleware.js";


const router = Router();
const cartsManager = new CartsManager();

// ------------------------------ MONGO ---------------------------------------------------------
router.get("/", checkAuth,async (req, res) => {
    try {
        const cartsFound = await cartsManager.getAll();
        res.status(200).json({ status: true, payload: cartsFound});
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});

// CREAR UN NUEVO CARRITO
router.post("/", checkAuth, async (req, res) => {
    try {
        const newCart = await cartsManager.insertOne();
        res.status(200).send({ message: "Carrito agregado", payload: newCart });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});
// INSERTAR UNA CANTIDAD DE UN PRODUCTO A UN CARRITO
router.post("/:cid/product/:pid", checkAuth, async (req, res) => {
    const {cid, pid} = req.params;
    const {quantity} = req.body;

    if(!quantity) {
        return res.status(400).send({"error": "Faltan datos."});
    }

    try {
        const newProduct = await cartsManager.addProductToCart(cid, pid, Number(quantity));
        res.status(200).send({message: "Producto agregado", payload: newProduct});
    } catch (error) {
        throw new Error(error.message);
    }
});

// ELIMINAR UN CARRITO
router.delete("/:cid", checkAuth, async (req, res) => {
    const {cid} = req.params;
    if(!cid){
        return res.status(400).send({"error": "Faltan datos."});
    }

    try {
        const deleteCart = await cartsManager.deleteCart(cid);
        res.status(200).send({message: "Carrito eliminado", payload: deleteCart});
    } catch (error) {
        throw new Error(error.message);
    }    
})

// ELIMINAR DEL CARRITO UN PRODUCTO SELECCIONADO
router.delete("/:cid/products/:pid", checkAuth, async (req, res) => {
    const {cid, pid} = req.params;
    if(!cid || !pid){
        return res.status(400).send({"error": "Faltan datos."});
    }

    try {
        const deleteProduct = await cartsManager.deleteProductOfCart(cid, pid);
        res.status(200).send({message: "Producto eliminado", payload: deleteProduct});
    } catch (error) {
        throw new Error(error.message);
    }
});

// ACTUALIZAR EL CARRITO CON UN ARREGLO
router.put("/:cid", checkAuth, async (req, res) => {
    const {cid} = req.params;
    const {products} = req.body;
    if(!cid || !products){
        return res.status(400).send({"error": "Faltan datos."});
    }

    try {
        const updateCart = await cartsManager.updateCart(cid, products);
        res.status(200).send({message: "Carrito actualizado", payload: updateCart});
    } catch (error) {
        throw new Error(error.message);
    }
});

// ACTUALIZAR LA CANTIDAD DE EJEMPLARES DEL PRODUCTO
router.put("/:cid/products/:pid", checkAuth, async (req, res) =>{
    const {cid, pid} = req.params;
    const {quantity} = req.body;

    if(!quantity) {
        return res.status(400).send({"error": "Faltan datos."});
    }

    try {
        const updateQuantity = await cartsManager.updateQuantity(cid, pid, Number(quantity));
        res.status(200).send({message: "Cantidad de producto Actualizada", payload: updateQuantity});
    } catch (error) {
        throw new Error(error.message);
    }
});

// ELIMINAR PRODUCTOS DEL CARRITO
router.delete("/cart/:cid", checkAuth, async (req, res) => {
    const {cid} = req.params;
    if(!cid){
        return res.status(400).send({"error": "Faltan datos."});
    }

    try {
        const deleteProductsCart = await cartsManager.deleteProductsCart(cid);
        res.status(200).send({message: "Productos de Carrito Eliminados", payload: deleteProductsCart});
    } catch (error) {
        throw new Error(error.message);
    }
});

// METODO GET CON POPULATE
router.get("/:cid", checkAuth, async (req, res) => {
    const {cid} = req.params;
    if(!cid){
        return res.status(400).send({"error": "Faltan datos."});
    }

    try {
        const cart = await cartsManager.getCartById(cid);
        res.status(200).json({ status: true, payload: cart});
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});

router.post('/:cid/addProduct', checkAuth, async (req, res) => {
    const { cid } = req.params;
    const { productId, quantity } = req.body;

    try {
        const updatedCart = await cartsManager.addProductToCart(cid, productId, quantity);
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;