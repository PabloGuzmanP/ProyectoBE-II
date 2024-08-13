import BaseRouter from "../base.router.js";

export default class RealTimeProductsRouter extends BaseRouter {
    constructor(){
        super();
        this.initialize();
    }

    initialize(){
        this.addGetRoute("/", [], (req, res) => this.#getTemplateRealTimeProducts(req, res));
    }

    #getTemplateRealTimeProducts(req, res){
        res.render("realTimeProducts");
    }
}