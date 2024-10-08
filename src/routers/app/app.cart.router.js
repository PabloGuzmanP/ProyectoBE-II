import BaseRouter from "../base.router.js";
// import CartsManager from "../../managers/CartsManager.js";
import CartService from "../../services/cart.service.js";

export default class CartRouter extends BaseRouter {
    // #cartsManager;
    #cartsService

    constructor() {
        super();
        this.initialize();
        // this.#cartsManager = new CartsManager();
        this.#cartsService = new CartService();
    }

    initialize() {
        this.addGetRoute("/:cid", [], (req, res) => this.#getCartById(req, res));
    }

    async #getCartById(req, res) {
        const { cid } = req.params;
        const { order } = req.query;

        if (!cid) {
            return res.status(400).send({ "error": "Faltan datos." });
        }

        try {
            const cart = await this.#cartsService.getCartById(cid);

            if (order) {
                cart.products.sort((asc, desc) => {
                    if (order === 'asc') {
                        return asc.productId.price - desc.productId.price;
                    } else if (order === 'desc') {
                        return desc.productId.price - asc.productId.price;
                    }
                    return 0;
                });
            }

            res.render("cart", { cart: cart.toObject() });
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    }
}