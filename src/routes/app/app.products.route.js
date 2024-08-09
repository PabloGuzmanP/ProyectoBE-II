import { json, Router } from "express";
import ProductsManager from "../../managers/ProductsManager.js";

const router = Router();
const productsManager = new ProductsManager();

router.get("/:id", async (req, res) => {
    const {id} = req.params;
    

    const productFound = await productsManager.getOneById(id);
    console.log(productFound);
    const product = {
        title: productFound.title,
        description: productFound.description,
        code: productFound.code,
        price: productFound.price,
        status: productFound.status,
        stock: productFound.stock,
        category: productFound.category,
        thumbnails: productFound.thumbnails
    };

    res.render("product", { products: product });
});

export default router;