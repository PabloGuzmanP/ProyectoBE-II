import BaseRouter from "../base.router.js";
import CartsManager from "../../managers/CartsManager.js";
import { ADMIN, USER, PREMIUM } from "../../constants/roles.constant.js";

export default class CartRouter extends BaseRouter {
    #cartsManager;

    constructor() {
        super();
        this.#cartsManager = new CartsManager();
    }

    initialize() {
        const router = this.getRouter();

        this.addGetRoute("/", [USER], (req, res) => this.#getAll(req, res));
        this.addPostRoute("/", [PREMIUM, ADMIN], (req, res) => this.#createCart(req, res));
        this.addPostRoute("/:cid/product/:pid", [USER], (req, res) => this.#insertQuantityOfProductInCart(req, res));
        this.addDeleteRoute("/:cid", [ADMIN], (req, res) => this.#deleteCart(req, res));
        this.addDeleteRoute("/:cid/product/:pid", [PREMIUM, ADMIN], (req, res) => this.#deleteProductOfCart(req, res));
        this.addPutRoute("/:cid", [PREMIUM, ADMIN], (req, res) => this.#updateCartWithArray(req, res));
        this.addPutRoute("/:cid/product/:pid", [USER], (req, res) => this.#updateQuantityOfProductInCart(req, res));
        this.addDeleteRoute("/cart/:cid", [USER], (req, res) => this.#deleteAllProductsOfCart(req, res));
        this.addGetRoute("/:cid", [USER], (req, res) => this.#getPopulate(req, res));
        this.addPostRoute("/:cid/addProduct", [USER], (req, res) => this.#addProductToCart(req, res));

        router.use((err, req, res, next) => {
            res.sendError(err);
        });
    }

    async #getAll(req, res) {        
        try {        
            const cartsFound = await this.#cartsManager.getAll();    
            res.sendSuccess200(cartsFound);
        } catch (error) {
            res.sendError(error);
        }
    }

    async #createCart(req, res) {
        try {
            const newCart = await this.#cartsManager.insertOne();
            res.sendSuccess201(newCart);
        } catch (error) {
            res.sendError(error);
        }
    }

    async #insertQuantityOfProductInCart(req, res) {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        if (!quantity) {
            return res.status(400).send({ "error": "Faltan datos." });
        }
        try {
            const newProduct = await this.#cartsManager.addProductToCart(cid, pid, Number(quantity));
            res.sendSuccess201(newProduct);
        } catch (error) {
            res.sendError(error);
        }
    }

    async #deleteCart(req, res) {
        const { cid } = req.params;
        if (!cid) {
            return res.status(400).send({ "error": "Faltan datos." });
        }

        try {
            const deleteCart = await this.#cartsManager.deleteCart(cid);

            
            res.sendSuccess200(deleteCart);
        } catch (error) {
            res.sendError(error);
        }
    }

    async #deleteProductOfCart(req, res) {
        const { cid, pid } = req.params;
        if (!cid || !pid) {
            return res.status(400).send({ "error": "Faltan datos." });
        }
        try {
            const deleteProduct = await this.#cartsManager.deleteProductOfCart(cid, pid);
            res.sendSuccess200(deleteProduct);
        } catch (error) {
            res.sendError(error);
        }
    }

    async #updateCartWithArray(req, res){
        const {cid} = req.params;
        const {products} = req.body;
        if(!cid || !products){
            return res.status(400).send({"error": "Faltan datos."});
        }
        try {
            const updateCart = await this.#cartsManager.updateCart(cid, products);
            res.sendSuccess200(updateCart);
        } catch (error) {
            res.sendError(error);
        }
    }

    async #updateQuantityOfProductInCart(req, res) {
        const {cid, pid} = req.params;
        const {quantity} = req.body;

        if(!quantity) {
            return res.status(400).send({"error": "Faltan datos."});
        }
        try {
            const updateQuantity = await this.#cartsManager.updateQuantity(cid, pid, Number(quantity));
            res.sendSuccess200(updateQuantity);
        } catch (error) {
            res.sendError(error);
        }
    }

    async #deleteAllProductsOfCart(req, res) {
        const {cid} = req.params;
        if(!cid){
            return res.status(400).send({"error": "Faltan datos."});
        }
        try {
            const deleteProductsCart = await this.#cartsManager.deleteProductsCart(cid);
            res.sendSuccess200(deleteProductsCart);
        } catch (error) {
            res.sendError(error);
        }
    }

    async #getPopulate(req, res) {
        const {cid} = req.params;
        if(!cid){
            return res.status(400).send({"error": "Faltan datos."});
        }
        try {
            const cart = await this.#cartsManager.getCartById(cid);
            res.sendSuccess200(cart);
        } catch (error) {
            res.sendError(error);
        }
    }

    async #addProductToCart(req, res) {
        const { cid } = req.params;
        const { productId, quantity } = req.body;

        try {
            const updatedCart = await this.#cartsManager.addProductToCart(cid, productId, quantity);
            res.sendSuccess200(updatedCart);
        } catch (error) {
            res.sendError(error);
        }
    }
}