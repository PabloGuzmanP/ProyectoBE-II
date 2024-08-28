import FactoryDAO from "../daos/factory.dao.js";
import UserDTO from "../dtos/user.dto.js";
import { MONGO_DAO } from "../constants/dao.constant.js";
import { ERROR_NOT_FOUND_CREDENTIALS, ERROR_NOT_FOUND_ID } from "../constants/messages.constant.js";
import { isValidHash } from "../utils/security.js";

export default class UserRepository {
    #userDAO;
    #userDTO;

    constructor(){
        const factory = new FactoryDAO();
        this.#userDAO = factory.createUser(MONGO_DAO);
        this.#userDTO = new UserDTO();
    }

    async findAll(params){
        const $and = [];

        if(params?.name) $and.push({ name: { $regex: params.name, $options: "i" } });
        const filters = $and.length > 0 ? { $and } : {};

        const users = await this.#userDAO.findAll(filters, params);
        const usersDTO = users?.docs?.map((user) => this.#userDTO.fromModel(user));
        users.docs = usersDTO;

        return users;
    }

    async findOneById(id) {
        const user = await this.#userDAO.findOneById(id);
        if(!user) throw new Error(ERROR_NOT_FOUND_ID);
        
        return this.#userDTO.fromModel(user);
    }

    async findOneByEmailAndPassword(email, password){
        const user = await this.#userDAO.findOneByCriteria({ email });
        if(!user) throw new Error(ERROR_NOT_FOUND_CREDENTIALS);

        const hash = user.password;
        if(!isValidHash(password, hash)){
            throw new Error(ERROR_NOT_FOUND_CREDENTIALS);
        }

        return this.#userDTO.fromModel(user);
    }

    async save(data){    
        const userDTO = this.#userDTO.fromData(data);
        const user = await this.#userDAO.save(userDTO);        
        return this.#userDTO.fromModel(user);
    }

    async deleteOneById(id){
        const user = await this.findOneById(id);
        console.log(user);
        
        await this.#userDAO.deleteOneById(id);
        return user;
    }
}