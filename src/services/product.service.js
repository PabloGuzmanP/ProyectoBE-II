import ProductDAO from "../daos/product.dao.js";

export default class ProductService {
    #productDAO

    constructor(){
        this.#productDAO = new ProductDAO();
    }

    async getAll(limit = 10, page = 1, query = {}, sort){
        const products = await this.#productDAO.getAll(limit = 10, page = 1, query = {}, sort);
        return products;
    }

    async getOneById(id){
        const product = await this.#productDAO.getOneById(id);
        return product;
    }

    async getProducts(){
        const products = await this.#productDAO.getProducts();
        return products;
    }

    async addProduct(productData){
        const newProduct = new this.#productDAO.addProduct(productData);
        return newProduct;
    }

    async deleteProduct(id){
        const deleteProduct = await this.#productDAO.deleteProduct(id);
        if (!deleteProduct) {
            throw new Error("Producto no encontrado");
        }
        return deleteProduct;
    }

    async updatedProduct(id, data){
        const productUpdated = await this.#productDAO.updatedProduct(id, data);
        if(!productUpdated) {
            throw new Error("Producto no encontrado");
        }
        return productUpdated;
    }
}