import { Server } from "socket.io";
import products from "../product.js"
import ProductsManager from "../managers/ProductsManager.js";

const productsManager = new ProductsManager();

const config = (serverHTTP) => {
    const serverSocket = new Server(serverHTTP);

    serverSocket.on("connection", async (socket) => {
        console.log("Cliente conectado!");

        socket.emit("updateProducts", await productsManager.getProducts());

        socket.on("getProducts", async () => {
            const productList = await productsManager.getProducts();
            socket.emit("updateProducts", productList);
        });

        socket.on("formulario", async () => {
            const updatedProducts = await productsManager.getProducts();
            serverSocket.emit("updateProducts", updatedProducts);
        });
    });
    return serverSocket;
};

export default { config };