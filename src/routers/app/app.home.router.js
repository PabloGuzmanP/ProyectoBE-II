import BaseRouter from "../base.router.js";
// import ProductsManager from "../../managers/ProductsManager.js";
// import CartsManager from "../../managers/CartsManager.js";
import ProductService from "../../services/product.service.js";
import CartService from "../../services/cart.service.js";

export default class HomeRouter extends BaseRouter {
    // #productsManager;
    // #cartsManager;

    #productsService
    #cartsService

    constructor() {
        super();
        // this.#productsManager = new ProductsManager();
        // this.#cartsManager = new CartsManager();
        this.#productsService = new ProductService();
        this.#cartsService = new CartService();
        this.initialize;
    }

    initialize() {
        const router = this.getRouter();

        this.addGetRoute("/", [], (req, res) => this.#getTemplateHome(req, res));

        router.use((error, req, res, next) => {
            res.sendError(error);
        });
    }

    async #getTemplateHome(req, res) {
        const { limit = 10, page = 1, order = "asc", category } = req.query;

        try {
            const parsedLimit = parseInt(limit, 10);
            const parsedPage = parseInt(page, 10);
            const sort = { field: "price", order: order === "desc" ? -1 : 1 };
            const query = category ? { category } : {};

            const productsFound = await this.#productsService.getAll(parsedLimit, parsedPage, query, sort);

            const carts = await this.#cartsService.getAll();
            const cartsWithStringIds = carts.map(cart => ({
                ...cart.toObject(),
                _id: cart._id.toString()
            }));

            const buildLink = (page) => {
                let link = `${req.protocol}://${req.get('host')}${req.originalUrl.split('?')[0]}?limit=${parsedLimit}&page=${page}`;
                if (order) {
                    link += `&order=${order}`;
                }
                if (category) {
                    link += `&category=${encodeURIComponent(category)}`;
                }
                return link;
            }

            const prevLink = productsFound.hasPrevPage ? buildLink(productsFound.prevPage) : null;
            const nextLink = productsFound.hasNextPage ? buildLink(productsFound.nextPage) : null;

            res.render("home", { products: productsFound.docs, carts: cartsWithStringIds, pagination: { ...productsFound, prevLink, nextLink } });
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    }
}