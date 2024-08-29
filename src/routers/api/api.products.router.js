import BaseRouter from "../base.router.js";
import ProductController from "../../controllers/product.controller.js";
import { ADMIN, USER } from "../../constants/roles.constant.js";

export default class ProductsRouter extends BaseRouter {
    #productController;

    constructor() {
        super();
        this.#productController = new ProductController();
    }

    initialize() {
        const router = this.getRouter();

        this.addGetRoute("/", [USER], (req, res) => this.#productController.getAll(req, res));
        this.addGetRoute("/:id", [USER], (req, res) => this.#productController.getProductById(req, res));
        this.addPostRoute("/", [ADMIN], (req, res) => this.#productController.createProduct(req, res));
        this.addPutRoute("/:id", [ADMIN], (req, res) => this.#productController.updateProduct(req, res));
        this.addDeleteRoute("/:id", [ADMIN], (req, res) => this.#productController.deleteProduct(req, res));

        router.use((err, req, res, next) => {
            res.sendError(err);
        });
    }
}