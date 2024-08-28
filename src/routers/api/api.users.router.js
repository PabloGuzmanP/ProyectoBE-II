import BaseRouter from "../base.router.js";
import UserController from "../../controllers/user.controller.js";
import { ADMIN, USER } from "../../constants/roles.constant.js";

export default class UserRouter extends BaseRouter{
    #userController;

    constructor(){
        super();
        this.#userController = new UserController();
    }

    initialize(){
        const router = this.getRouter();

        this.addGetRoute("/", [], (req, res) => this.#userController.getAll(req, res));
        this.addGetRoute("/:id", [], (req, res) => this.#userController.getUserById(req, res));
        this.addPostRoute("/", [], (req, res) => this.#userController.createUser(req, res));
        this.addPutRoute("/:id", [], (req, res) => this.#userController.updateUser(req, res));
        this.addDeleteRoute("/:id", [], (req, res) => this.#userController.deleteUser(req, res));

        // this.addGetRoute("/", [USER], (req, res) => this.#userController.getAll(req, res));
        // this.addGetRoute("/:id", [USER], (req, res) => this.#userController.getUserById(req, res));
        // this.addPostRoute("/", [], (req, res) => this.#userController.createUser(req, res));
        // this.addPutRoute("/:id", [ADMIN], (req, res) => this.#userController.updateUser(req, res));
        // this.addDeleteRoute("/:id", [ADMIN], (req, res) => this.#userController.deleteUser(req, res));

        router.use((err, req, res, next) => {
            res.sendError(err);
        });
    }
}