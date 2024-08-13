import BaseRouter from "../base.router.js";
import UsersManager from "../../managers/UsersManager.js";
import { ADMIN, USER } from "../../constants/roles.constant.js";

export default class UserRouter extends BaseRouter{
    #usersManager;

    constructor(){
        super();
        this.#usersManager = new UsersManager();
    }

    initialize(){
        const router = this.getRouter();

        this.addGetRoute("/", [USER], (req, res) => this.#getAll(req, res));
        this.addGetRoute("/:id", [USER], (req, res) => this.#getUserById(req, res));
        this.addPostRoute("/", [], (req, res) => this.#createUser(req, res));
        this.addPutRoute("/:id", [ADMIN], (req, res) => this.#updateUser(req, res));
        this.addDeleteRoute("/:id", [ADMIN], (req, res) => this.#deleteUser(req, res));

        router.use((err, req, res, next) => {
            res.sendError(err);
        });
    }

    async #getAll(req, res) {
        try {
            const usersFound = await this.#usersManager.getAll();
            res.sendSuccess200(usersFound);
        } catch (error) {
            res.sendError(error);
        }
    }

    async #getUserById(req, res) {
        const { id } = req.params;
        try {
            const userFound = await this.#usersManager.getOneByID(id);
            res.sendSuccess200(userFound);
        } catch (error) {
            res.sendError(error);
        }
    }

    async #createUser(req, res){
        try {
            const user = await this.#usersManager.insertOne(req.body);
            res.sendSuccess201(user);
        } catch (error) {
            res.sendError(error);
        }
    }

    async #updateUser (req, res){
        const { id } = req.params;
        const updateFields = req.body;

        try {
            const updateUser = await this.#usersManager.updateOneById(id, updateFields);
            res.sendSuccess200(updateUser);
        } catch (error) {
            res.sendError(error)
        }
    }

    async #deleteUser(req, res){
        const { id } = req.params;

        try {
            const user = await this.#usersManager.deleteOneById(id);
            res.sendSuccess200(user);
        } catch (error) {
            res.sendError(error);
        }
    }
}