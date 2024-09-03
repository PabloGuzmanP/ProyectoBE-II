import BaseRouter from "../base.router.js";
import CartController from "../../controllers/cart.controller.js";
import { ADMIN, USER } from "../../constants/roles.constant.js";
import { currentUser } from "../../middlewares/auth.middleware.js";

export default class CartRouter extends BaseRouter {
    #cartController;

    constructor() {
        super();
        this.#cartController = new CartController();
    }

    initialize() {
        const router = this.getRouter();
        this.addGetRoute("/", [USER], currentUser,(req, res) => this.#cartController.getAll(req, res));
        this.addPostRoute("/", [ADMIN], currentUser,(req, res) => this.#cartController.createCart(req, res));
        this.addPostRoute("/:cid/product/:pid", [USER], currentUser,(req, res) => this.#cartController.insertQuantityOfProductInCart(req, res));
        this.addDeleteRoute("/:cid", [ADMIN], currentUser,(req, res) => this.#cartController.deleteCart(req, res));
        this.addDeleteRoute("/:cid/product/:pid", [ADMIN], currentUser,(req, res) => this.#cartController.deleteProductOfCart(req, res));
        this.addPutRoute("/:cid", [ADMIN], currentUser,(req, res) => this.#cartController.updateCartWithArray(req, res));
        this.addPutRoute("/:cid/product/:pid", [USER], currentUser,(req, res) => this.#cartController.updateQuantityOfProductInCart(req, res));
        this.addDeleteRoute("/cart/:cid", [ADMIN], currentUser,(req, res) => this.#cartController.deleteAllProductsOfCart(req, res));
        this.addGetRoute("/:cid", [USER], currentUser,(req, res) => this.#cartController.getPopulate(req, res));
        this.addPostRoute("/:cid/add-product", [USER, ADMIN], currentUser,(req, res) => this.#cartController.addProductToCart(req, res));
        this.addGetRoute("/:cid/purchase", [USER, ADMIN], currentUser,(req, res) => this.#cartController.purchasingProcess(req, res));

        router.use((err, req, res, next) => {
            res.sendError(err);
        });
    }
}