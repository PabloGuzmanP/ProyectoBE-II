import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import UserService from "../services/user.service.js";

const userService = new UserService();

export const config = (server) => {
    const jwtApiOptions = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.SECRET_KEY
    };

    const handleLogin = async (payload, done) => {
        try {
            const userFound = await userService.getOneByID(payload.id);
            return done(null, userFound);
        } catch (error) {
            done (null, false, { message: error.message });
        }
    };

    passport.use("jwt-api", new JwtStrategy(jwtApiOptions, handleLogin));

    const cookieExtractor = req => {
        let token = null;
        if(req && req.cookies){
            token = req.cookies["cookieToken"];
        }        
        return token;
    }

    const jwtExtractCookie = {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.SECRET_KEY
    };

    const handleDataUser = async (payload, done) => {
        try {
            return done(null, payload); 
        } catch (error) {
            done (null, false, { message: error.message });
        }
    };

    passport.use("current", new JwtStrategy(jwtExtractCookie, handleDataUser));

    server.use(passport.initialize());
}