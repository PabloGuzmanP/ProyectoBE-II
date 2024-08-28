import ProductService from "../services/product.service.js";

export default class ProductController {
    #productService;

    constructor(){
        this.#productService = new ProductService();
    }

    async getAll(req, res) {
        try {
            const recipes = await this.#productService.findAll(req.query);
            res.sendSuccess200(recipes);
        } catch (error) {
            res.sendError(error);
        }
    }

    async getProductById(req, res){
        const { id } = req.params;
        try {
            const productFound = await this.#productService.findOneById(id);
            res.sendSuccess200(productFound);
        } catch (error) {
            res.sendError(error);
        }
    }

    async createProduct(req, res){
        try {
            const newProduct = req.body
            const result = await this.#productService.insertOne(newProduct);
            res.sendSuccess201(result);
        } catch (error) {
            res.sendError(error);
        }
    }

    async updateProduct(req, res){
        const { id } = req.params;
        const updateFields = req.body;
        try {
            const updateProduct = await this.#productService.updateOneById(id, updateFields);
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
            const deleteProduct = await this.#productService.deleteOneById(id);
            res.sendSuccess200(deleteProduct);
        } catch (error) {
            res.sendError(error);
        }
    }
}