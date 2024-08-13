import express from"express";
import path from "./utils/path.js";
import cookieParser from "cookie-parser";

// Imports APP
import homeRouter from "./routers/app/app.home.router.js";
import realTimeProductsRouter from "./routers/app/app.realTimeProducts.router.js";
import productsRouter from "./routers/app/app.products.router.js";
import cartRouter from "./routers/app/app.cart.router.js";

// Imports API
import apiAuthRouter from "./routers/api/api.auth.router.js";
import apiCartsRouter from "./routers/api/api.carts.router.js";
import apiProductsRouter from "./routers/api/api.products.router.js";
import apiUsersRouter from "./routers/api/api.users.router.js";
import apiSessionRouter from "./routers/api/api.sessions.router.js";

// Imports Configurations
import serverSocketIO from "./config/socket.config.js";
import handlebarsConfig from "./config/handlebars.config.js";
import mongoDB from "./config/mongoose.config.js";
import { config as dotenvConfig } from "dotenv";
import { config as configPassport } from "./config/passport.config.js";

const server = express();

server.use(express.urlencoded({extended: true}));
server.use(express.json());
server.use(cookieParser(process.env.SECRET_KEY));

dotenvConfig({ path: path.env });

handlebarsConfig.config(server);

configPassport(server);

// Rutas de la aplicación 
server.use("/", new homeRouter().getRouter());
server.use("/real-time-products", new realTimeProductsRouter().getRouter());
server.use("/products", new productsRouter().getRouter());
server.use("/cart-products", new cartRouter().getRouter());

// Rutas de la API
server.use("/api/auth", new apiAuthRouter().getRouter());
server.use("/api/carts", new apiCartsRouter().getRouter());
server.use("/api/products", new apiProductsRouter().getRouter());
server.use("/api/users", new apiUsersRouter().getRouter());
server.use("/api/sessions", new apiSessionRouter().getRouter());


server.use("/api/public", express.static(path.public));

server.use("*", (req, res) => {
    res.status(404).send("<h1>Error 404</h1><h3>La URL indicada no existe en este servidor</h3>");
});

server.use((error, req, res) => {
    console.log("Error:", error.message);
    res.status(500).send("<h1>Error 500</h1><h3>Se ha generado un error en el servidor</h3>");
});

const serverHTTP = server.listen(process.env.PORT, () => {
    console.log(`Se esta ejecutando el servidor http://localhost:${process.env.PORT}`);
    mongoDB.connectDB();
});

serverSocketIO.config(serverHTTP);