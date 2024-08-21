import UserService from "../services/user.service.js";

export default class UserController {
    #userService

    constructor(){
        this.#userService = new UserService();
    }

    async getAll(req, res) {
        try {
            const usersFound = await this.#userService.getAll();
            res.sendSuccess200(usersFound);
        } catch (error) {
            res.sendError(error);
        }
    }

    async getUserById(req, res) {
        const { id } = req.params;
        try {
            const userFound = await this.#userService.getOneByID(id);
            res.sendSuccess200(userFound);
        } catch (error) {
            res.sendError(error);
        }
    }

    async createUser(req, res){
        try {
            const user = await this.#userService.insertOne(req.body);
            res.sendSuccess201(user);
        } catch (error) {
            res.sendError(error);
        }
    }

    async updateUser (req, res){
        const { id } = req.params;
        const updateFields = req.body;

        try {
            const updateUser = await this.#userService.updateOneById(id, updateFields);
            res.sendSuccess200(updateUser);
        } catch (error) {
            res.sendError(error)
        }
    }

    async deleteUser(req, res){
        const { id } = req.params;

        try {
            const user = await this.#userService.deleteOneById(id);
            res.sendSuccess200(user);
        } catch (error) {
            res.sendError(error);
        }
    }
}