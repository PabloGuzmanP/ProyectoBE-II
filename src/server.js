import express from"express";
import path from "./utils/path.js";

import homeRouter from "./routes/app/app.home.route.js";
import realTimeProductsRouter from "./routes/app/app.realTimeProducts.route.js";
import productsRouter from "./routes/app/app.products.route.js";
import cartRouter from "./routes/app/app.cart.route.js";
import apiProductsRouter from "./routes/api/api.products.route.js";
import apiCartsRouter from "./routes/api/api.carts.route.js";

import serverSocketIO from "./config/socket.config.js";
import handlebarsConfig from "./config/handlebars.config.js";
import mongoDB from "./config/mongoose.config.js";
import { config as dotenvConfig } from "dotenv";

const PORT = 8080;
const HOST = "localhost";
const server = express();

server.use(express.urlencoded({extended: true}));
server.use(express.json());

dotenvConfig({ path: path.env });

// Rutas de la aplicación 
server.use("/", homeRouter);
server.use("/real-time-products", realTimeProductsRouter);
server.use("/products", productsRouter);
server.use("/cart-products", cartRouter);

// Rutas de la API
server.use("/api/products", apiProductsRouter);
server.use("/api/carts", apiCartsRouter);

handlebarsConfig.config(server);

server.use("/api/public", express.static(path.public));

server.use("*", (req, res) => {
    res.status(404).send("<h1>Error 404</h1><h3>La URL indicada no existe en este servidor</h3>");
});

server.use((error, req, res) => {
    console.log("Error:", error.message);
    res.status(500).send("<h1>Error 500</h1><h3>Se ha generado un error en el servidor</h3>");
});

const serverHTTP = server.listen(PORT, () => {
    console.log(`Se esta ejecutando el servidor http://${HOST}:${PORT}`);
    mongoDB.connectDB();
});

serverSocketIO.config(serverHTTP);