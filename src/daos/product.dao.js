import ProductModel from "../models/product.model.js";

export default class ProductDAO {
    #productModel;

    constructor(){
        this.#productModel = ProductModel;
    }

    async getAll(limit = 10, page = 1, query = {}, sort){
        const options = {
            limit: parseInt(limit, 10),
            page: parseInt(page, 10),
            lean: true,
            sort: { price: sort.order }
        };

        const queryFilter = {};
        if (query && query.category) {
            queryFilter.category = query.category;
        }

        const products = await this.#productModel.paginate(queryFilter, options);
        return products;
    }

    async getOneById(id){
        const product = await this.#productModel.findById(id);
        return product;
    }

    async getProducts(){
        const products = await this.#productModel.find();
        return products;
    }

    async addProduct(productData){
        const newProduct = new this.#productModel(productData);
        const savedProduct = await newProduct.save();
        return savedProduct;
    }

    async deleteProduct(id){
        const deleteProduct = await this.#productModel.findByIdAndDelete(id);
        if (!deleteProduct) {
            throw new Error("Producto no encontrado");
        }
        return deleteProduct;
    }

    async updatedProduct(id, data){
        const productUpdated = await this.#productModel.findByIdAndUpdate(id, data);
        if(!productUpdated) {
            throw new Error("Producto no encontrado");
        }
        return productUpdated;
    }
}