import CartDAO from "../daos/cart.dao.js";

export default class CartService {
    #cartDAO

    constructor(){
        this.#cartDAO = new CartDAO();
    }

    async getAll(){
        return await this.#cartDAO.getAll();
    }

    async insertOne(){
        const newCart = await this.#cartDAO.insertOne();
        return newCart;
    }

    async addProductToCart(cid, pid, quantity){
        const updatedCart = await this.#cartDAO.addProductToCart(cid, pid, quantity);

        return updatedCart;
    }

    async deleteCart(cid){
        const deletedCart = await this.#cartDAO.deleteCart(cid);
        if (!deletedCart) {
            throw new Error("Carrito no encontrado");
        }
        return deletedCart;
    }

    async deleteProductOfCart(cid, pid){
        const updatedCart = await this.#cartDAO.deleteProductOfCart(cid, pid);
        return updatedCart;
    }
    async updateCart(cid, products){
        const updateCart = await this.#cartDAO.updateCart(cid, products);
        return updateCart;
    }

    async updateQuantity(cid, pid, quantity){
        const updatedCart = await this.#cartDAO.updateQuantity(cid, pid, quantity);
        return updatedCart;
    }

    async deleteProductsCart(cid){
        const updatedCart = await this.#cartDAO.deleteProductsCart(cid);
        return updatedCart;
    }

    async getCartById(cid){
        const cart = await this.#cartDAO.getCartById(cid);
        if(!cart){
            throw new Error("Carrito no encontrado");
        }

        return cart;
    }
}