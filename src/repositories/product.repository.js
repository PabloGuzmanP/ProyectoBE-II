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
        const { page = 1, limit = 10, ...filters } = params;
        const $and = [];

        if (filters?.category) $and.push({ category: { $regex: filters.category, $options: "i" } });
        const queryFilters = $and.length > 0 ? { $and } : {};

        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
        };

        const products = await this.#productDAO.findAll(queryFilters, options);
        const productsDTO = products?.docs?.map((product) => this.#productDTO.fromModel(product));
        products.docs = productsDTO;

        const baseUrl = 'http://localhost:8080/api/products';
        const { hasNextPage, nextPage, hasPrevPage, prevPage } = products;

        return {
            products: products.docs,
            pagination: {
                currentPage: options.page,
                totalPages: products.totalPages,
                nextPage: hasNextPage ? `${baseUrl}?page=${nextPage}&limit=${options.limit}` : null,
                prevPage: hasPrevPage ? `${baseUrl}?page=${prevPage}&limit=${options.limit}` : null,
                totalDocs: products.totalDocs
            }
        };
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