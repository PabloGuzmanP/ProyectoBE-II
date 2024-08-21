import CartService from "../services/cart.service.js";

export default class CartController {
    #cartService

    constructor(){
        this.#cartService = new CartService();
    }

    async getAll(req, res){
        try {        
            const cartsFound = await this.#cartService.getAll();    
            res.sendSuccess200(cartsFound);
        } catch (error) {
            res.sendError(error);
        }
    }

    async createCart(req, res) {
        try {
            const newCart = await this.#cartService.insertOne();
            res.sendSuccess201(newCart);
        } catch (error) {
            res.sendError(error);
        }
    }

    async insertQuantityOfProductInCart(req, res) {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        if (!quantity) {
            return res.status(400).send({ "error": "Faltan datos." });
        }
        try {
            const newProduct = await this.#cartService.addProductToCart(cid, pid, Number(quantity));
            res.sendSuccess201(newProduct);
        } catch (error) {
            res.sendError(error);
        }
    }

    async deleteCart(req, res) {
        const { cid } = req.params;
        if (!cid) {
            return res.status(400).send({ "error": "Faltan datos." });
        }
        try {
            const deleteCart = await this.#cartService.deleteCart(cid);
            res.sendSuccess200(deleteCart);
        } catch (error) {
            res.sendError(error);
        }
    }

    async deleteProductOfCart(req, res) {
        const { cid, pid } = req.params;
        if (!cid || !pid) {
            return res.status(400).send({ "error": "Faltan datos." });
        }
        try {
            const deleteProduct = await this.#cartService.deleteProductOfCart(cid, pid);
            res.sendSuccess200(deleteProduct);
        } catch (error) {
            res.sendError(error);
        }
    }

    async updateCartWithArray(req, res){
        const {cid} = req.params;
        const {products} = req.body;
        if(!cid || !products){
            return res.status(400).send({"error": "Faltan datos."});
        }
        try {
            const updateCart = await this.#cartService.updateCart(cid, products);
            res.sendSuccess200(updateCart);
        } catch (error) {
            res.sendError(error);
        }
    }

    async updateQuantityOfProductInCart(req, res) {
        const {cid, pid} = req.params;
        const {quantity} = req.body;

        if(!quantity) {
            return res.status(400).send({"error": "Faltan datos."});
        }
        try {
            const updateQuantity = await this.#cartService.updateQuantity(cid, pid, Number(quantity));
            res.sendSuccess200(updateQuantity);
        } catch (error) {
            res.sendError(error);
        }
    }

    async deleteAllProductsOfCart(req, res) {
        const {cid} = req.params;
        if(!cid){
            return res.status(400).send({"error": "Faltan datos."});
        }
        try {
            const deleteProductsCart = await this.#cartService.deleteProductsCart(cid);
            res.sendSuccess200(deleteProductsCart);
        } catch (error) {
            res.sendError(error);
        }
    }

    async getPopulate(req, res) {
        const {cid} = req.params;
        if(!cid){
            return res.status(400).send({"error": "Faltan datos."});
        }
        try {
            const cart = await this.#cartService.getCartById(cid);
            res.sendSuccess200(cart);
        } catch (error) {
            res.sendError(error);
        }
    }

    async addProductToCart(req, res) {
        const { cid } = req.params;
        const { productId, quantity } = req.body;

        try {
            const updatedCart = await this.#cartService.addProductToCart(cid, productId, quantity);
            res.sendSuccess200(updatedCart);
        } catch (error) {
            res.sendError(error);
        }
    }
}