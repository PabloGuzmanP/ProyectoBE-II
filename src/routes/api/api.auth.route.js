import { Router } from "express";
import { generateToken } from "../../middlewares/auth.middleware.js";

const router= Router();

router.post("/login", generateToken, async (req, res, next) => {
    try {
        const token = req.token;
        // Almacenar token en una cookie
        res.cookie("cookieToken", token, { httpOnly: true })
        // Mostrar el token como response para que el usuario le quede mas facil cuando este desde POSTMAN
        res.status(200).json({ status: true, payload: token });
    } catch (error) {
        next(error);
    }
});


export default router;