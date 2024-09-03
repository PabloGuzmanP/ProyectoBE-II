import ProductRepository from "../repositories/product.repository.js";

export default class ProductService {
    #productRepository;

    constructor(){
        this.#productRepository = new ProductRepository();
    }

    async findAll(params){
        return await this.#productRepository.findAll(params);
    }

    async findOneById(id){
        return await this.#productRepository.findOneById(id);
    }

    async insertOne(data){
        return await this.#productRepository.save({
            ...data,
        });
    }

    async updateOneById(id, data){
        const currentProduct = await this.#productRepository.findOneById(id);
        
        const product = await this.#productRepository.save({
            ...currentProduct,
            ...data,
        });        

        return product;
    }

    async deleteOneById(id){
        return await this.#productRepository.deleteOneById(id);
    }
}