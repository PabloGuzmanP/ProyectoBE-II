import { generateToken } from "../../middlewares/auth.middleware.js";
import BaseRouter from "../base.router.js";

export default class AuthRouter extends BaseRouter {
    constructor(){
        super();
    }

    initialize(){
        const router = this.getRouter();

        this.addPostRoute("/login", [], generateToken, (req, res) => this.#login(req, res));
        this.addGetRoute("/logout", [], (req, res) => this.#logout(req, res));

        router.use((err, req, res, next) => {
            res.sendError(err);
        })
    }

    #login(req, res){
        try {
            const token = req.token ?? null;
            res.cookie("cookieToken", token, { httpOnly: true })
            res.sendSuccess201(token);
        } catch (error) {
            res.sendError(error)
        }
    }

    #logout(req, res) {
        try {
            res.clearCookie("cookieToken");
            res.status(200).send("Has cerrado sesion")
        } catch (error) {
            res.sendError(error)
        }
    }
}