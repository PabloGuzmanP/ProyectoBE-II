import fs from "fs";
import path from "path";
import Path from "./utils/path.js"

class cart {
    #route;
    #carts;

    constructor(route){
        this.#route= route;
        this.#carts = [];
    };

    #generarId(){
        let id = 0;
        this.#carts.forEach(cart => {
            if(cart.id > id){
                id = cart.id;
            };
        });
        return id + 1;
    };

    addCart = async () => {
        const cart = {
            id: this.#generarId(),
            products: []
        };
        this.#carts.push(cart);
        return await fs.promises.writeFile(this.#route, JSON.stringify(this.#carts, null, "\t"));
    };

    getCartById = async (id) => {
        const data = await this.convertData();
        
        const cart = data.find(cart => cart.id === id);

        if(cart){
            return cart;
        } else {
            return console.log("No se encontro ese Id en el archivo.");
        };
    };

    addProductToCart = async (idCart, idProduct, quantity) => {
        const data = await this.convertData();

        const product = {
            id: idProduct,
            quantity
        };

        const cart = data.find(cart => cart.id === idCart);
        if(!cart){
            console.log("No se encontró el carrito con el ID proporcionado.");
            return;
        };

        const productInCart = cart.products.find(product => product.id === idProduct);

        if(productInCart){
            productInCart.quantity += quantity;
        } else {
            cart.products.push(product);
        };

        return await fs.promises.writeFile(this.#route, JSON.stringify(data, null, "\t"));
    }

    convertData = async () => {
        const data = await fs.promises.readFile(this.#route, "utf-8");
        return JSON.parse(data);
    };
}

const filePath = path.resolve(Path.files, "carts.json");

const cartInstance = new cart(filePath);
export default cartInstance;