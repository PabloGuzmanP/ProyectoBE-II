import { Router } from "express";
import UserManager from "../../managers/UsersManager.js";


const router = Router();
const userManager = new UserManager();

// Ruta para obtener todas las usuarios
router.get("/", async (req, res, next) => {
    try {
        const users = await userManager.getAll(req.query);
        res.status(200).json({ status: true, payload: users });
    } catch (error) {
        next(error);
    }
});

// Ruta para obtener una usuario por su ID
router.get("/:id", async (req, res, next) => {
    try {
        const user = await userManager.getOneById(req.params.id);
        res.status(200).json({ status: true, payload: user });
    } catch (error) {
        next(error);
    }
});

// Ruta para crear una nueva usuario
router.post("/", async (req, res, next) => {
    try {
        const user = await userManager.insertOne(req.body);
        res.status(201).json({ status: true, payload: user });
    } catch (error) {
        next(error);
    }
});

// Ruta para actualizar una usuario existente por su ID
router.put("/:id", async (req, res, next) => {
    try {
        const user = await userManager.updateOneById(req.params.id, req.body);
        res.status(200).json({ status: true, payload: user });
    } catch (error) {
        next(error);
    }
});

// Ruta para eliminar una usuario por su ID
router.delete("/:id", async (req, res, next) => {
    try {
        console.log("Entro");
        
        const user = await userManager.deleteOneById(req.params.id);
        res.status(200).json({ status: true, payload: user });
        console.log("Lo Elimino");
    } catch (error) {
        next(error);
    }
});

export default router;