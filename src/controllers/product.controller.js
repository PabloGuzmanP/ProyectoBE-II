import ProductService from "../services/product.service.js";

export default class ProductController {
    #productService;

    constructor(){
        this.#productService = new ProductService();
    }

    async getAll(req, res){
        const { limit = 10, page = 1, order = "asc", category } = req.query;
        try {
            const parsedLimit = parseInt(limit, 10);
            const parsedPage = parseInt(page, 10);
            const sort = { field: "price", order: order === "desc" ? -1 : 1 };
            const query = category ? { category } : {};

            const productsFound = await this.#productService.getAll(parsedLimit, parsedPage, query, sort);

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

    async getProductById(req, res){
        const { id } = req.params;
        try {
            const productFound = await this.#productService.getOneById(id);
            res.sendSuccess200(productFound);
        } catch (error) {
            res.sendError(error);
        }
    }

    async createProduct(req, res){
        try {
            const newProduct = req.body
            const result = await this.#productService.addProduct(newProduct);
            res.sendSuccess201(result);
        } catch (error) {
            res.sendError(error);
        }
    }

    async updateProduct(req, res){
        const { id } = req.params;
        const updateFields = req.body;
        try {
            const updateProduct = await this.#productService.updatedProduct(id, updateFields);
            if(!updateFields){
                res.status(404).send({ error: "Producto no encontrado" });
            } else {
                res.sendSuccess200(updateProduct)
            }
        } catch (error) {
            res.sendError(error);
        }
    }

    async deleteProduct (req, res) {
        const { id } = req.params;

        try {
            const deleteProduct = await this.#productService.deleteProduct(id);
            res.sendSuccess200(deleteProduct);
        } catch (error) {
            res.sendError(error);
        }
    }
}