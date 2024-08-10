import jwt from "jsonwebtoken";
import passport from "passport";
import UserManager from "../managers/UsersManager.js"
import { ERROR_NOT_HAVE_PRIVILEGES, JWT_TRANSLATIONS } from "../constants/messages.constant.js";

const userManager = new UserManager();

export const generateToken = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const userFound = await userManager.getOneByEMailAndPassword(email, password);

        const token = jwt.sign({ id: userFound._id }, process.env.SECRET_KEY, { expiresIn: "2h" });

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

        req.role = user.role
        next();
    })(req, res, next);
};

export const checkRoleAdmin = async (req, res, next) => {
    if(req.role !== "admin"){
        return next(new Error(ERROR_NOT_HAVE_PRIVILEGES));
    }
    next();
};