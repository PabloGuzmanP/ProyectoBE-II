import FactoryDAO from "../daos/factory.dao.js";
import CartDTO from "../dtos/cart.dto.js";
import { MONGO_DAO } from "../constants/dao.constant.js";
import { ERROR_NOT_FOUND_ID } from "../constants/messages.constant.js";

export default class CartRepository {
    #cartDAO;
    #cartDTO;
    #productDAO;

    constructor() {
        const factory = new FactoryDAO();
        this.#cartDAO = factory.createCart(MONGO_DAO);
        this.#cartDTO = new CartDTO();
        this.#productDAO = factory.createProduct(MONGO_DAO);
    }

    async findAll(params) {
        const $and = [];

        if (params?.title) $and.push({ title: { $regex: params.title, $options: "i" } });
        const filters = $and.length > 0 ? { $and } : {};

        const carts = await this.#cartDAO.findAll(filters, params);
        const cartsDTO = carts?.docs?.map((cart) => this.#cartDTO.fromModel(cart));
        carts.docs = cartsDTO;

        return carts;
    }

    async findOneById(id) {
        const cart = await this.#cartDAO.findOneById(id);
        if (!cart) throw new Error(ERROR_NOT_FOUND_ID);

        return this.#cartDTO.fromModel(cart);
    }

    async save(data) {
        const cartDTO = this.#cartDTO.fromData(data);
        const cart = await this.#cartDAO.save(cartDTO);
        return this.#cartDTO.fromModel(cart);
    }

    async deleteOneById(id) {
        const cart = await this.findOneById(id);
        await this.#cartDAO.deleteOneById(id);
        return cart;
    }

    // async addProductToCart(cid, pid, quantity) {
    //     const cart = await this.findOneById(cid);

    //     // const product = await this.#productDAO.findOneById(pid);
    //     // if (!product) throw new Error(ERROR_NOT_FOUND_ID);

    //     const productIndex = cart.products.findIndex(p => p.productId.toString() === pid);
    //     if (productIndex !== -1) {
    //         cart.products[productIndex].quantity += quantity;
    //     } else {
    //         cart.products.push({ productId: pid, quantity: quantity });
    //     }

    //     const updatedCart = await this.save(cart);
    //     return updatedCart;
    // }

    // async deleteProductOfCart(cid, pid){
    //     const cart = await this.findOneById(cid);
        
    //     const productIndex = cart.products.findIndex(p => p.productId.toString() === pid.toString());
    //     if(productIndex === -1){
    //         throw new Error ("Producto no encontrado en carrito");
    //     }
        
    //     cart.products.splice(productIndex, 1);

    //     const updatedCart = await this.save(cart);
    //     return updatedCart;
    // }

    // async updateQuantity(cid, pid, quantity){
    //     const cart = await this.findOneById(cid);

    //     const product = await this.#productDAO.findOneById(pid);
    //     if (!product) throw new Error(ERROR_NOT_FOUND_ID);

    //     const productIndex = cart.products.findIndex(p => p.productId.toString() === pid);
    //     if(productIndex !== -1){
    //         cart.products[productIndex].quantity = quantity;
    //     }else {
    //         cart.products.push({productId: pid, quantity: quantity});
    //     }

    //     const updatedCart = await this.save(cart);
    //     return updatedCart;
    // }

    // async deleteProductsCart(cid){
    //     const cart = await this.findOneById(cid);
    //     await this.#cartDAO.deleteMany({ products })

    //     const updatedCart = await this.save(cart);
    //     return updatedCart;
    // }

    async getCartById(cid){
        const cart = await this.#cartDAO.findOneByIdWithPopulate(cid);
        return cart;
    }
}