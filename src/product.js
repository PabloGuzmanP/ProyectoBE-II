import path from "path";
import fs from "fs";
import Path from "./utils/path.js"

class product {
    #route;
    #products;

    constructor(route){
        this.#route= route;
        this.#products = [];
    };

    #generarId= async () => {
        const data = await this.convertData();
        let id = 0;
        data.forEach(product => {
            if(product.id > id){
                id = product.id;
            };
        });
        return id + 1;
    };

    getProducts = async (limit) => {
        const data = await this.convertData();
        if(!limit || limit > data.length){
            return data;
        }

        return data.slice(0, limit);
    };

    getProductsById = async (id) => {
        const data = await this.convertData();
        
        const product = data.find(product => product.id === id);

        if(product){
            return product;
        }
    };

    addProduct = async (title, description, code, price, stock, category, thumbnails) => {
        const data = await this.convertData();

        const product = {
            id: await this.#generarId(),
            title,
            description,
            code,
            price,
            status: true,
            stock,
            category,
            thumbnails: [thumbnails]
        };
        data.push(product);
        console.log(this.#products);
        return await fs.promises.writeFile(this.#route,
            JSON.stringify(data, null, "\t")
        );
    };

    updateProduct = async (id, updateFields) => {
        const data = await this.convertData();

        const productIndex = data.findIndex(product => product.id === id);

        if(productIndex !== -1){
            console.log("Producto encontrado:", data[productIndex]);
            for(const key in updateFields){
                if(updateFields.hasOwnProperty(key)){
                    data[productIndex][key] = updateFields[key];
                }
            }
            await fs.promises.writeFile(this.#route, JSON.stringify(data, null, "\t"));
            console.log("Producto actualizado:", data[productIndex]);
        } else {
            console.log("No se encontro ese id en el archivo, por lo cual no se puede actualizar.");
        };
    };

    deleteProduct = async (id) => {
        const data = await this.convertData();

        const newProducts = data.filter(item => item.id !== id);

        if(newProducts.length < data.length){
            await fs.promises.writeFile(this.#route, JSON.stringify(newProducts, null, "\t"));
            console.log("Se elimino correctamente");
        } else {
            console.log("No se pudo eliminar");
        };
    };

    convertData = async () => {
        const data = await fs.promises.readFile(this.#route, "utf-8");
        return JSON.parse(data);
    };
};

const filePath = path.resolve(Path.files, "products.json");

const productInstance = new product(filePath);
export default productInstance;