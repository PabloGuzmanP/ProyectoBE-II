import { Server } from "socket.io";
import ProductService from "../services/product.service.js";

const productsService = new ProductService();

const config = (serverHTTP) => {
    const serverSocket = new Server(serverHTTP);

    serverSocket.on("connection", async (socket) => {
        console.log("Cliente conectado!");

        socket.emit("updateProducts", await productsService.getProducts());

        socket.on("getProducts", async () => {
            const productList = await productsService.getProducts();
            socket.emit("updateProducts", productList);
        });

        socket.on("formulario", async () => {
            const updatedProducts = await productsService.getProducts();
            serverSocket.emit("updateProducts", updatedProducts);
        });
    });
    return serverSocket;
};

export default { config };