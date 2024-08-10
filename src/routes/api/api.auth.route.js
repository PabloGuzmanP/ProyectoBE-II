import { Router } from "express";
import { generateToken } from "../../middlewares/auth.middleware.js";

const router= Router();

router.post("/login", generateToken, async (req, res, next) => {
    try {
        const token = req.token;
        res.status(200).json({ status: true, payload: token });
    } catch (error) {
        next(error);
    }
});

export default router;