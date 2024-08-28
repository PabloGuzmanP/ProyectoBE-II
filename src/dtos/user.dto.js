import { createHash } from "../utils/security.js";

export default class UserDTO {
    fromModel(model){
        return {
            id: model.id,
            fullname: `${model.first_name} ${model.last_name}`,
            email: model.email,
            age: model.age,
            cart: model.cart,
            roles: model.roles,
        };
    }

    fromData(data){
        const name = data.fullname?.split(" ");

        return{
            id: data.id || null,
            first_name: name[0] ?? "",
            last_name: name[1] ?? "",
            email: data.email,
            age: data.age,
            password: data.password ? createHash(data.password) : null,
            cart: data.cart,
            roles: data.roles,
        }
    }
}