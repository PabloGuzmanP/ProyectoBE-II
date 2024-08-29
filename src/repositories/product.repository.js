import FactoryDAO from "../daos/factory.dao.js";
import ProductDTO from "../dtos/product.dto.js";
import { MONGO_DAO } from "../constants/dao.constant.js";
import { ERROR_NOT_FOUND_ID } from "../constants/messages.constant.js";

export default class ProductRepository {
    #productDAO;
    #productDTO;

    constructor() {
        const factory = new FactoryDAO();
        this.#productDAO = factory.createProduct(MONGO_DAO);
        this.#productDTO = new ProductDTO();
    }

    async findAll(params) {
        const $and = [];

        if (params?.category) $and.push({ category: { $regex: params.category, $options: "i" } });
        const filters = $and.length > 0 ? { $and } : {};

        const products = await this.#productDAO.findAll(filters, params);
        const productsDTO = products?.docs?.map((product) => this.#productDTO.fromModel(product));
        products.docs = productsDTO;

        return products;
    }

    async findOneById(id) {
        const product = await this.#productDAO.findOneById(id);
        if (!product) throw new Error(ERROR_NOT_FOUND_ID);

        return this.#productDTO.fromModel(product);
    }

    async save(data) {
        const productDTO = this.#productDTO.fromData(data);
        const product = await this.#productDAO.save(productDTO);
        return this.#productDTO.fromModel(product);
    }

    async deleteOneById(id) {
        const product = await this.findOneById(id);
        await this.#productDAO.deleteOneById(id);
        return product;
    }
}