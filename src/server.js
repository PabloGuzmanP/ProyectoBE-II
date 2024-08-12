import express from"express";
import path from "./utils/path.js";
import cookieParser from "cookie-parser";

import homeRouter from "./routes/app/app.home.route.js";
import realTimeProductsRouter from "./routes/app/app.realTimeProducts.route.js";
import productsRouter from "./routes/app/app.products.route.js";
import cartRouter from "./routes/app/app.cart.route.js";

import apiAuthRouter from "./routes/api/api.auth.route.js";
import apiProductsRouter from "./routes/api/api.products.route.js";
import apiCartsRouter from "./routes/api/api.carts.route.js";
import apiUsersRouter from "./routes/api/api.users.route.js"
import apiSessionRouter from "./routes/api/api.sessions.route.js"

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
server.use("/", homeRouter);
server.use("/real-time-products", realTimeProductsRouter);
server.use("/products", productsRouter);
server.use("/cart-products", cartRouter);

// Rutas de la API
server.use("/api/auth", apiAuthRouter);
server.use("/api/carts", apiCartsRouter);
server.use("/api/products", apiProductsRouter);
server.use("/api/users", apiUsersRouter);
server.use("/api/sessions", apiSessionRouter)


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