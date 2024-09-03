import BaseRouter from "../base.router.js";
import { currentUser } from "../../middlewares/auth.middleware.js";
import CartService from "../../services/cart.service.js";

export default class CurrentRouter extends BaseRouter {
    constructor(){
        super();
    }

    initialize(){
        const router = this.getRouter();

        this.addGetRoute("/current", [], currentUser, (req, res) => this.#getCurrent(req, res));

        router.use((err, req, res, next) => {
            res.sendError(err);
        });
    }

    async #getCurrent (req, res) {
        try {
            const user = req.user;
            
            res.sendSuccess200(user);
        } catch (error) {
            res.sendError(error);
        }
    }
}