import mongoose from "mongoose";
import UserModel from "../models/user.model.js";
import { createHash, isValidHash } from "../utils/security.js";

import {
    ERROR_NOT_FOUND_CREDENTIALS
} from "../constants/messages.constant.js";


export default class UsersManager {
    #userModel;

    constructor(){
        this.#userModel = UserModel;
    }

    #handleError = (error) => {
        if (error instanceof mongoose.Error.ValidationError) {
            throw new Error(Object.values(error.errors)[0].message);
        }
        throw new Error(error.message);
    };

    getAll = async (limit = 10, page = 1) => {
        try {
            const $and = [];

            const filters = $and.length > 0 ? { $and } : {};

            const options = {
                limit: parseInt(limit, 10),
                page: parseInt(page, 10),
                lean: true,
            }

            const usersFound = await this.#userModel.paginate(filters, options)
            return usersFound;
        } catch (error) {
            this.#handleError(error)
        }
    };

    getOneByID = async (id) => {
        try {
            const userFound = await this.#userModel.findById(id);

            return userFound.toObject();
        } catch (error) {
            this.#handleError(error)
        }
    };

    getOneByEMailAndPassword = async (email, password) => {
        try {
            const userFound = await this.#userModel.findOne({ email });
            if(!userFound){
                throw new Error(ERROR_NOT_FOUND_CREDENTIALS)
            }

            const hash = userFound.password;
            if(!isValidHash(password, hash)){
                throw new Error(ERROR_NOT_FOUND_CREDENTIALS)
            }

            return userFound.toObject();
        } catch (error) {
            this.#handleError(error);
        }
    };

    insertOne = async (data) => {
        try {
            const user = new UserModel({
                ...data,
                password: data.password ? createHash(data.password) : null,
            });

            await user.save();
            return user.toObject();
        } catch (error) {
            this.#handleError(error);
        }
    };

    updateOneById = async (id, data) => {
        try {
            const userFound = await this.#userModel.findById(id);

            const newValues = {
                ...data,
                password: data.password ? createHash(data.password) : null,
            };

            userFound.set(newValues);
            await userFound.save();

            return userFound.toObject();
        } catch (error) {
            this.#handleError(error);
        }
    };

    deleteOneById = async (id) => {
        try {
            const userFound = await this.#userModel.findById(id);

            await this.#userModel.deleteOne({ _id: userFound._id });
        } catch (error) {
            this.#handleError(error);
        }
    };
}