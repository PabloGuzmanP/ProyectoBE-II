import BaseRouter from "../base.router.js";
import ProductController from "../../controllers/product.controller.js";
import { ADMIN, USER } from "../../constants/roles.constant.js";
import { currentUser } from "../../middlewares/auth.middleware.js";

export default class ProductsRouter extends BaseRouter {
    #productController;

    constructor() {
        super();
        this.#productController = new ProductController();
    }

    initialize() {
        const router = this.getRouter();

        this.addGetRoute("/", [USER], currentUser, (req, res) => this.#productController.getAll(req, res));
        this.addGetRoute("/:id", [USER], currentUser, (req, res) => this.#productController.getProductById(req, res));
        this.addPostRoute("/", [ADMIN], currentUser, (req, res) => this.#productController.createProduct(req, res));
        this.addPutRoute("/:id", [ADMIN], currentUser, (req, res) => this.#productController.updateProduct(req, res));
        this.addDeleteRoute("/:id", [ADMIN], currentUser, (req, res) => this.#productController.deleteProduct(req, res));

        router.use((err, req, res, next) => {
            res.sendError(err);
        });
    }
}