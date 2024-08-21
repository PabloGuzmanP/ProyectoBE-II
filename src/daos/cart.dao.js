import CartModel from "../models/cart.model.js";
import ProductModel from "../models/product.model.js";

export default class CartDAO {
    #cartModel;
    #productModel;

    constructor(){
        this.#cartModel = CartModel;
        this.#productModel = ProductModel;
    }

    async getAll(){
        return await this.#cartModel.find();
    }

    async insertOne(){
        const newCart = new CartModel({products: []});
        await newCart.save();
        return newCart;
    }

    async addProductToCart(cid, pid, quantity){
        const cart = await this.#cartModel.findById(cid);
        if(!cart){
            throw new Error("Carrito no encontrado");
        }

        const product = await this.#productModel.findById(pid)
        if(!product){
            throw new Error("Producto no encontrado");
        }

        const productIndex = cart.products.findIndex(p => p.productId.toString() === pid);
        if(productIndex !== -1){
            cart.products[productIndex].quantity += quantity;
        }else {
            cart.products.push({productId: pid, quantity: quantity});
        }

        const updatedCart = await cart.save();
        return updatedCart;
    }

    async deleteCart(cid){
        const deletedCart = await this.#cartModel.findByIdAndDelete(cid);
        return deletedCart;
    }

    async deleteProductOfCart(cid, pid){
        const cart = await this.#cartModel.findById(cid);
        if(!cart){
            throw new Error("Carrito no encontrado");
        }
        const productIndex = cart.products.findIndex(p => p.productId.toString() === pid.toString());
        if(productIndex === -1){
            throw new Error ("Producto no encontrado en carrito");
        }
        
        cart.products.splice(productIndex, 1);

        const updatedCart = await cart.save();
        return updatedCart;
    }

    async updateCart(cid, products){
        const cart = await this.#cartModel.findById(cid);
        if(!cart){
            throw new Error("Carrito no encontrado");
        }
        cart.products = products;

        const updateCart = await cart.save();
        return updateCart;
    }

    async updateQuantity(cid, pid, quantity){
        const cart = await this.#cartModel.findById(cid);
        if(!cart){
            throw new Error("Carrito no encontrado");
        }

        const product = await this.#productModel.findById(pid);
        if(!product){
            throw new Error("Producto no encontrado");
        }

        const productIndex = cart.products.findIndex(p => p.productId.toString() === pid);
        if(productIndex !== -1){
            cart.products[productIndex].quantity = quantity;
        }else {
            cart.products.push({productId: pid, quantity: quantity});
        }

        const updatedCart = await cart.save();
        return updatedCart;
    }

    async deleteProductsCart(cid){
        const cart = await this.#cartModel.findById(cid);
        if(!cart){
            throw new Error("Carrito no encontrado");
        }
        
        cart.products = [];

        const updatedCart = await cart.save();
        return updatedCart;
    }

    async getCartById(cid){
        const cart = await this.#cartModel.findById(cid).populate("products.productId");
        return cart;
    }
}