import BaseRouter from "../base.router.js";
import UserController from "../../controllers/user.controller.js";
import { ADMIN, USER } from "../../constants/roles.constant.js";
import { currentUser } from "../../middlewares/auth.middleware.js";

export default class UserRouter extends BaseRouter{
    #userController;

    constructor(){
        super();
        this.#userController = new UserController();
    }

    initialize(){
        const router = this.getRouter();

        this.addGetRoute("/", [], currentUser, (req, res) => this.#userController.getAll(req, res));
        this.addGetRoute("/:id", [USER], currentUser, (req, res) => this.#userController.getUserById(req, res));
        this.addPostRoute("/", [], currentUser, (req, res) => this.#userController.createUser(req, res));
        this.addPutRoute("/:id", [ADMIN], currentUser, (req, res) => this.#userController.updateUser(req, res));
        this.addDeleteRoute("/:id", [ADMIN], currentUser, (req, res) => this.#userController.deleteUser(req, res));

        router.use((err, req, res, next) => {
            res.sendError(err);
        });
    }
}