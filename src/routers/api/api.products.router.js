import BaseRouter from "../base.router.js";
import ProductsManager from "../../managers/ProductsManager.js";
import { ADMIN, USER } from "../../constants/roles.constant.js";

export default class ProductsRouter extends BaseRouter {
    #productsManager

    constructor() {
        super();
        this.#productsManager = new ProductsManager();
    }

    initialize() {
        const router = this.getRouter();

        this.addGetRoute("/", [USER], (req, res) => this.#getAll(req, res));
        this.addGetRoute("/:id", [USER], (req, res) => this.#getProductById(req, res));
        this.addPostRoute("/", [ADMIN], (req, res) => this.#createProduct(req, res));
        this.addPutRoute("/:id", [ADMIN], (req, res) => this.#updateProduct(req, res));
        this.addDeleteRoute("/:id", [ADMIN], (req, res) => this.#deleteProduct(req, res));

        router.use((err, req, res, next) => {
            res.sendError(err);
        });
    }

    async #getAll(req, res) {
        const { limit = 10, page = 1, order = "asc", category } = req.query;

        try {
            const parsedLimit = parseInt(limit, 10);
            const parsedPage = parseInt(page, 10);
            const sort = { field: "price", order: order === "desc" ? -1 : 1 };
            const query = category ? { category } : {};

            const productsFound = await this.#productsManager.getAll(parsedLimit, parsedPage, query, sort);

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

            res.sendSuccess200({ ...productsFound, prevLink, nextLink });
        } catch (error) {
            res.sendError(error);
        }
    }

    async #getProductById(req, res){
        const { id } = req.params;
        try {
            const productFound = await this.#productsManager.getOneById(id);
            res.sendSuccess200(productFound);
        } catch (error) {
            res.sendError(error);
        }
    }

    async #createProduct(req, res){
        try {
            const newProduct = req.body
            const result = await this.#productsManager.addProduct(newProduct);
            res.sendSuccess201(result);
        } catch (error) {
            res.sendError(error);
        }
    }

    async #updateProduct(req, res){
        const { id } = req.params;
        const updateFields = req.body;
        try {
            const updateProduct = await this.#productsManager.updatedProduct(id, updateFields);
            if(!updateFields){
                res.status(404).send({ error: "Producto no encontrado" });
            } else {
                res.sendSuccess200(updateProduct)
            }
        } catch (error) {
            res.sendError(error);
        }
    }

    async #deleteProduct (req, res) {
        const { id } = req.params;

        try {
            const deleteProduct = await this.#productsManager.deleteProduct(id);
            res.sendSuccess200(deleteProduct);
        } catch (error) {
            res.sendError(error);
        }
    }
}