import { Router } from "express";
import { currentUser } from "../../middlewares/auth.middleware.js";

const router = Router()

router.get("/current", currentUser, async (req, res, next) => {
    try {
        const user = req.user;
        res.status(200).json({ status: true, payload: user });
    } catch (error) {
        next(error);
    }
})

export default router;