import UserDAO from "../daos/user.dao.js";

export default class UserService {
    #userDAO

    constructor(){
        this.#userDAO = new UserDAO();
    }

    async getAll(limit = 10, page = 1){
        return await this.#userDAO.getAll(limit = 10, page = 1);
    }

    async getOneByID(id){
        const user = this.#userDAO.getOneByID(id);
        return user;
    }

    async getOneByEmailAndPassword(email, password){
        const userFound = this.#userDAO.getOneByEmailAndPassword(email, password);
        return userFound;
    }

    async insertOne(data){
        const userCreate = this.#userDAO.insertOne(data);
        return userCreate;
    }

    async updateOneById(id, data){
        const userUpdate = this.#userDAO.updateOneById(id, data);
        return userUpdate;
    }

    async deleteOneById(id){
        const userDelete = this.#userDAO.deleteOneById(id);
        return userDelete;
    }
}