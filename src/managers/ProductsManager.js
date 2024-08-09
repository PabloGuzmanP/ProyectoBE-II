import ProductModel from "../models/product.model.js";

export default class ProductsManager {
    #productModel;

    constructor() {
        this.#productModel = ProductModel;
    }

    getAll = async (limit = 10, page = 1, query = {}, sort) => {
        try {
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
        } catch (error) {
            throw new Error(error.message);
        }
    }
    

    getOneById = async (id) => {
        try {
            const product = await this.#productModel.findById(id);
            return product;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    getProducts = async () => {
        try {
            const products = await this.#productModel.find();
            return products;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    addProduct = async (productData) => {
        try {
            const newProduct = new this.#productModel(productData);
            const savedProduct = await newProduct.save();
            return savedProduct;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    deleteProduct = async (id) => {
        try {
            const deleteProduct = await this.#productModel.findByIdAndDelete(id);
            if (!deleteProduct) {
                throw new Error("Producto no encontrado");
            }
            return deleteProduct;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    updatedProduct = async (id, data) => {
        try {
            const productUpdated = await this.#productModel.findByIdAndUpdate(id, data);
            if(!productUpdated) {
                throw new Error("Producto no encontrado");
            }
            
            return productUpdated;
        } catch (error) {
            console.log("---------------------");
            throw new Error(error.message);
        }
    };
}
