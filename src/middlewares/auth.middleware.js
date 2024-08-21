import jwt from "jsonwebtoken";
import passport from "passport";
import UserService from "../services/user.service.js";
import { ERROR_NOT_HAVE_PRIVILEGES, JWT_TRANSLATIONS } from "../constants/messages.constant.js";

const userService = new UserService();

export const generateToken = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const userFound = await userService.getOneByEmailAndPassword(email, password);

        const token = jwt.sign({ id: userFound._id, firts_name: userFound.first_name, last_name: userFound.last_name, email: userFound.email, role: userFound.role }, process.env.SECRET_KEY, { expiresIn: "2h" });

        req.token = token;
        next();
    } catch (error) {
        next(error);
    }
};

export const checkAuth = async (req, res, next) => {
    passport.authenticate("jwt-api", { session: false }, (error, user, info) => {
        if(error) return next(error);

        if(!user) return next(new Error(JWT_TRANSLATIONS[info.message] ?? info.message));
        
        req.roles = user.roles;
        next();
    })(req, res, next);
};

export const currentUser = async (req, res, next) => {
    passport.authenticate("current", { session: false }, (error, user, info) =>{
        if(error) return next(error);

        if(!user) return next(new Error(JWT_TRANSLATIONS[info.message] ?? info.message));
        
        req.user = user
        next();
        
    })(req, res, next);
}