import {Router} from "express";
import ProductsManager from "../../managers/ProductsManager.js";

const router = Router();
const productsManager = new ProductsManager();

router.get("/", async (req, res) => {
    const { limit = 10, page = 1, order = "asc", category } = req.query;

    try {
        const parsedLimit = parseInt(limit, 10);
        const parsedPage = parseInt(page, 10);
        const sort = { field: "price", order: order === "desc" ? -1 : 1 };
        const query = category ? { category } : {};

        const productsFound = await productsManager.getAll(parsedLimit, parsedPage, query, sort);

        const buildLink = (page) => {
            let link = `${req.protocol}://${req.get('host')}${req.originalUrl.split('?')[0]}?limit=${parsedLimit}&page=${page}`;
            if (order) {
                link += `&order=${order}`;
            }
            if (category) {
                link += `&category=${encodeURIComponent(category)}`;
            }
            return link;
        }

        const prevLink = productsFound.hasPrevPage ? buildLink(productsFound.prevPage) : null;
        const nextLink = productsFound.hasNextPage ? buildLink(productsFound.nextPage) : null;

        res.status(200).json({ status: true, payload: { ...productsFound, prevLink, nextLink } });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});


router.get("/:id", async (req, res) => {
    const {id} = req.params;

    const getProduct = await productsManager.getOneById(id);
    res.status(200).send({status: "success", data:getProduct})
});

router.post("/", async (req, res) => {
    try {
        const newProduct = req.body;
        const result = await productsManager.addProduct(newProduct);
        res.status(201).json(result);
    } catch (error) {
        console.error("Error al agregar el producto:", error);
        res.status(500).json({ error: "Error al agregar el producto" });
    }
});

router.put("/:id", async (req, res) => {
    const {id} = req.params;
    const updateFields= req.body;

    const updateProduct = await productsManager.updatedProduct(id, updateFields);

    if(!updateFields){
        res.status(404).send({ error: "Producto no encontrado" });
    } else {
        res.status(200).send({ message: "Producto actualizado correctamente.",data: updateProduct });
    }
    
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await productsManager.deleteProduct(id);
        res.status(200).json({ message: "Producto eliminado con éxito" });
    } catch (error) {
        console.error("Error al eliminar el producto:", error);
        res.status(500).json({ error: "Error al eliminar el producto" });
    }
});


export default router;