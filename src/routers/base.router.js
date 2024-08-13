import { Router } from "express";
import { ERROR_INVALID_ID, ERROR_NOT_HAVE_PRIVILEGES, STATUS_CODES } from "../constants/messages.constant.js";
import { checkAuth } from "../middlewares/auth.middleware.js";

export default class BaseRouter {
    #router
    #statusCodes;

    constructor() {
        this.#router = Router()
        this.#statusCodes = STATUS_CODES;
        this.#defineCustomResponses();
        this.#addIdValidation();
        this.initialize();
    }

    initialize() {
        throw new Error("Este método debe ser sobrescrito en una clase hija");
    }

    #defineCustomResponses() {
        this.#router.use((req, res, next) => {
            res.sendSuccess200 = (payload) => res.status(200).json({ status: true, payload });
            res.sendSuccess201 = (payload) => res.status(201).json({ status: true, payload });
            res.sendError = (error) => this.#defineErrorResponse(error.message, res);
            next();
        });
    }

    #defineErrorResponse(errorMessage, res) {
        const statusCode = this.#statusCodes[errorMessage] || 500;
        res.status(statusCode).json({ status: false, message: errorMessage });
    }

    #addIdValidation(){
        const pattern = /^[0-9a-fA-F]{24}$/;

        this.#router.param("id", this.#validatePathParam(pattern, ERROR_INVALID_ID));
        this.#router.param("cid", this.#validatePathParam(pattern, ERROR_INVALID_ID));
        this.#router.param("pid", this.#validatePathParam(pattern, ERROR_INVALID_ID));
    }

    #validatePathParam(pattern, errorMessage) {
        return (req, res, next, paramValue) => {
            if (!pattern.test(paramValue)) {
                return next(new Error(errorMessage));
            }
            next();
        };
    }

    #checkPolicy(policies = []) {
        if (policies.length === 0) return [];

        return [ checkAuth, (req, res, next) => {
            const hasRequiredRole = policies.some((policy) => req.roles?.includes(policy));
            
            if (!hasRequiredRole) {
                return next(new Error(ERROR_NOT_HAVE_PRIVILEGES));
            }

            next();
        } ];
    }

    #addRoute(method, path, policies = [], ...callbacks){
        this.#router[method](path, this.#checkPolicy(policies), ...callbacks);
    }

    addGetRoute(path, policies = [], ...callbacks) {
        this.#addRoute("get", path, policies, ...callbacks);
    }

    addPostRoute(path, policies = [], ...callbacks) {
        this.#addRoute("post", path, policies, ...callbacks);
    }

    addPutRoute(path, policies = [], ...callbacks) {
        this.#addRoute("put", path, policies, ...callbacks);
    }

    addDeleteRoute(path, policies = [], ...callbacks) {
        this.#addRoute("delete", path, policies, ...callbacks);
    }

    getRouter() {
        return this.#router;
    }
}