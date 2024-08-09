import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import UserManager from "../managers/UsersManager.js"

const userManager = new UserManager();

export const config = (server) => {
    const jwtApiOptions = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.SECRET_KEY
    };

    const handleLogin = async (payload, done) => {
        try {
            const userFound = await userManager.getOneByID(passport.id);
            return done(null, userFound);
        } catch (error) {
            done (null, false, { message: error.message });
        }
    };

    passport.use("jwt-api", new JwtStrategy(jwtApiOptions, handleLogin));

    server.use(passport.initialize());
}