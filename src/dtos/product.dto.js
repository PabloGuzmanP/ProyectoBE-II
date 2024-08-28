import { convertToBoolean } from "../utils/converter.js";

export default class ProductDTO {
    fromModel(model){
        return {
            id: model.id,
            title: model.title,
            description: model.description,
            code: model.code,
            price: model.price,
            stock: model.stock,
            status: model.status,
            category: model.category,
            thumbnail: model.thumbnail,
        }
    }

    fromData(data){
        return {
            id: data.id || null,
            title: data.title,
            description: data.description,
            code: data.code,
            price: data.price,
            stock: Number(data.stock),
            status: convertToBoolean(data.status),
            category: data.category,
            thumbnail: data.thumbnail,
        };
    }
}