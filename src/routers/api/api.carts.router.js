import BaseRouter from "../base.router.js";
import CartController from "../../controllers/cart.controller.js";
import { ADMIN, USER, PREMIUM } from "../../constants/roles.constant.js";

export default class CartRouter extends BaseRouter {
    #cartController;

    constructor() {
        super();
        this.#cartController = new CartController();
    }

    initialize() {
        const router = this.getRouter();

        this.addGetRoute("/", [USER], (req, res) => this.#cartController.getAll(req, res));
        this.addPostRoute("/", [PREMIUM, ADMIN], (req, res) => this.#cartController.createCart(req, res));
        this.addPostRoute("/:cid/product/:pid", [USER], (req, res) => this.#cartController.insertQuantityOfProductInCart(req, res));
        this.addDeleteRoute("/:cid", [ADMIN], (req, res) => this.#cartController.deleteCart(req, res));
        this.addDeleteRoute("/:cid/product/:pid", [PREMIUM, ADMIN], (req, res) => this.#cartController.deleteProductOfCart(req, res));
        this.addPutRoute("/:cid", [PREMIUM, ADMIN], (req, res) => this.#cartController.updateCartWithArray(req, res));
        this.addPutRoute("/:cid/product/:pid", [USER], (req, res) => this.#cartController.updateQuantityOfProductInCart(req, res));
        this.addDeleteRoute("/cart/:cid", [USER], (req, res) => this.#cartController.deleteAllProductsOfCart(req, res));
        this.addGetRoute("/:cid", [USER], (req, res) => this.#cartController.getPopulate(req, res));
        this.addPostRoute("/:cid/addProduct", [USER], (req, res) => this.#cartController.addProductToCart(req, res));

        router.use((err, req, res, next) => {
            res.sendError(err);
        });
    }
}