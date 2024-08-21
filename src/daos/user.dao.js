import UserModel from "../models/user.model.js";
import { createHash, isValidHash } from "../utils/security.js";

import {
    ERROR_NOT_FOUND_CREDENTIALS
} from "../constants/messages.constant.js";

export default class UserDAO {
    #userModel;

    constructor(){
        this.#userModel = UserModel;
    }

    async getAll(limit = 10, page = 1){
        const $and = [];

            const filters = $and.length > 0 ? { $and } : {};

            const options = {
                limit: parseInt(limit, 10),
                page: parseInt(page, 10),
                lean: true,
            }

            const usersFound = await this.#userModel.paginate(filters, options)
            return usersFound;
    }

    async getOneByID(id){
        const userFound = await this.#userModel.findById(id);
        return userFound.toObject();
    }

    async getOneByEmailAndPassword(email, password){
        const userFound = await this.#userModel.findOne({ email });
            if(!userFound){
                throw new Error(ERROR_NOT_FOUND_CREDENTIALS)
            }

            const hash = userFound.password;
            if(!isValidHash(password, hash)){
                throw new Error(ERROR_NOT_FOUND_CREDENTIALS)
            }

            return userFound.toObject();
    }

    async insertOne(data){
        const user = new UserModel({
            ...data,
            password: data.password ? createHash(data.password) : null,
        });

        await user.save();
        return user.toObject();
    }

    async updateOneById(id, data){
        const userFound = await this.#userModel.findById(id);
        const newValues = {
            ...data,
            password: data.password ? createHash(data.password) : null,
        };
        userFound.set(newValues);
        await userFound.save();

        return userFound.toObject();
    }

    async deleteOneById(id){
        const userFound = await this.#userModel.findById(id);
        await this.#userModel.deleteOne({ _id: userFound._id });
    }
}