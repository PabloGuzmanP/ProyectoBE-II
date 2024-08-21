import BaseRouter from "../base.router.js";
// import ProductsManager from "../../managers/ProductsManager.js";
import ProductService from "../../services/product.service.js";

export default class ProductsRouter extends BaseRouter {
    #productsService
    // #productsManager;

    constructor() {
        super();
        this.initialize();
        // this.#productsManager = new ProductsManager();
        this.#productsService = new ProductService();
    }

    initialize() {
        this.addGetRoute("/:id", [], (req, res) => this.#getAll(req, res));
    }

    async #getAll(req, res) {
        const { id } = req.params;

        const productFound = await this.#productsService.getOneById(id);
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