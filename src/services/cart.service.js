import { ERROR_NOT_ENOUGH_STOCK, ERROR_NOT_FOUND_INDEX, ERROR_NOT_SAME_ID } from "../constants/messages.constant.js";
import CartRepository from "../repositories/cart.repository.js";
import ProductService from "./product.service.js";
import UserRepository from "../repositories/user.repository.js";
import TicketService from "./ticket.service.js"

export default class CartService {
    #cartRepository;
    #productService;
    #ticketService;
    #userRepository;

    constructor() {
        this.#cartRepository = new CartRepository();
        this.#productService = new ProductService();
        this.#ticketService = new TicketService();
        this.#userRepository = new UserRepository();
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

    async purchasingProcess(cid, email){
        const user = await this.#userRepository.findOneByEmail(email);
        const cart = await this.#cartRepository.findOneById(cid);
        const notAvailableProducts = [];
        let amount = 0;

        if(cid !== user.cart.toString()){
            throw new Error(ERROR_NOT_SAME_ID);
        } 
        
        for (let index = 0; index < cart.products.length; index++) {
            const idProduct = cart.products[index].productId;
            const quantityProduct = cart.products[index].quantity;
            const product = await this.#productService.findOneById(idProduct);
            
            if (quantityProduct > product.stock) {
                notAvailableProducts.push(product.title)
            }else {
                const newStock = product.stock - quantityProduct;
                await this.#productService.updateOneById(idProduct, { stock: newStock });
                amount += product.price * quantityProduct;
            }
        }

        const ticketData = {
            amount: amount,
            purchaser: email
        };
        
        const ticket = await this.#ticketService.createTicket(ticketData);

        if(notAvailableProducts.length > 0){
            return {ticket: ticket, processNotComplete: `No hay suficiente stock de: ${notAvailableProducts}`};
        } else {
            return {ticket: ticket};
        }
    }
}