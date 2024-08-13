import BaseRouter from "../base.router.js";
import ProductsManager from "../../managers/ProductsManager.js";

export default class ProductsRouter extends BaseRouter {
    #productsManager;

    constructor() {
        super();
        this.initialize();
        this.#productsManager = new ProductsManager();
    }

    initialize() {
        this.addGetRoute("/:id", [], (req, res) => this.#getAll(req, res));
    }

    async #getAll(req, res) {
        const { id } = req.params;

        const productFound = await this.#productsManager.getOneById(id);
        const product = {
            title: productFound.title,
            description: productFound.description,
            code: productFound.code,
            price: productFound.price,
            status: productFound.status,
            stock: productFound.stock,
            category: productFound.category,
            thumbnails: productFound.thumbnails
        };

        res.render("product", { products: product });
    }
}