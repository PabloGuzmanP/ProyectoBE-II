import { MONGO_DAO } from "../constants/dao.constant.js";
import CartModel from "./mongo/models/cart.model.js";
import ProductModel from "./mongo/models/product.model.js";
import TicketModel from "./mongo/models/ticket.model.js";
import UserModel from "./mongo/models/user.model.js";
import MongoDAO from "./mongo/mongo.dao.js";

export default class FactoryDAO {
    createProduct(className){
        if(className === MONGO_DAO){
            return new MongoDAO(ProductModel);
        }
    };
    createCart(className){
        if(className === MONGO_DAO){
            return new MongoDAO(CartModel);
        }
    };
    createUser(className){
        if(className === MONGO_DAO){
            return new MongoDAO(UserModel);
        }
    };
    createTicket(className){
        if(className === MONGO_DAO){
            return new MongoDAO(TicketModel);
        }
    };
}