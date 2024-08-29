import { ERROR_NOT_FOUND_INDEX } from "../constants/messages.constant.js";
import CartRepository from "../repositories/cart.repository.js";

export default class CartService {
    #cartRepository

    constructor() {
        this.#cartRepository = new CartRepository();
    }

    async findAll(params) {
        return await this.#cartRepository.findAll(params);
    }

    async findOneById(id) {
        return await this.#cartRepository.findOneById(id).populate("products.productId");
    }

    async insertOne(data) {
        return await this.#cartRepository.save({ ...data });
    }

    async addProductToCart(cid, pid, quantity) {
        const cart = await this.#cartRepository.findOneById(cid);
        const productIndex = cart.products.findIndex(p => p.productId.toString() === pid);
        if (productIndex !== -1) {
            cart.products[productIndex].quantity += quantity;
        } else {
            cart.products.push({ productId: pid, quantity: quantity });
        }

        return await this.#cartRepository.save(cart);
    }

    async deleteOneById(id) {
        return await this.#cartRepository.deleteOneById(id);
    }

    async deleteProductOfCart(cid, pid, quantity) {
        const cart = await this.#cartRepository.findOneById(cid);
        const productIndex = cart.products.findIndex(p => p.productId.toString() === pid);
        if (productIndex < 0) throw new Error(ERROR_NOT_FOUND_INDEX);


        if (cart.products[productIndex].quantity > quantity) {
            cart.products[productIndex].quantity -= quantity;
        } else {
            cart.products.splice(productIndex, 1);
        }

        return await this.#cartRepository.save(cart);
    }


    async updateOneById(cid, newProducts) {
        const cart = await this.#cartRepository.findOneById(cid);

        const existingProductsMap = new Map(cart.products.map(product => [product.productId.toString(), product]));
        newProducts.forEach(newProduct => {
            const existingProduct = existingProductsMap.get(newProduct.productId);
            if (existingProduct) {
                existingProduct.quantity += newProduct.quantity;
            } else {
                cart.products.push(newProduct);
            }
        });

        return await this.#cartRepository.save(cart);
    }

    async updateQuantity(cid, pid, quantity) {
        const cart = await this.#cartRepository.findOneById(cid);
        const productIndex = cart.products.findIndex(p => p.productId.toString() === pid);
        if (productIndex !== -1) {
            cart.products[productIndex].quantity = quantity;
        } else {
            cart.products.push({ productId: pid, quantity: quantity });
        }

        return await this.#cartRepository.save(cart);
    }

    async deleteProductsCart(cid) {
        const cart = await this.#cartRepository.findOneById(cid);
        cart.products = [];

        return await this.#cartRepository.save(cart);
    }

    async getCartById(cid) {
        const cart = await this.#cartRepository.getCartById(cid);
        return cart;
    }
}