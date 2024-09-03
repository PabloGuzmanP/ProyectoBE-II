import FactoryDAO from "../daos/factory.dao.js";
import TicketDTO from "../dtos/ticket.dto.js";
import { MONGO_DAO } from "../constants/dao.constant.js";

export default class TicketRepository {
    #ticketDAO;
    #ticketDTO;

    constructor() {
        const factory = new FactoryDAO();
        this.#ticketDAO = factory.createTicket(MONGO_DAO);
        this.#ticketDTO = new TicketDTO();
    }

    async create(ticketData) {
        const ticketDTO = this.#ticketDTO.fromData(ticketData);
        const ticket = await this.#ticketDAO.save(ticketDTO);
        return this.#ticketDTO.fromModel(ticket);
    }

    async findAll(params){
        const $and = [];

        if(params?.name) $and.push({ name: { $regex: params.name, $options: "i" } });
        const filters = $and.length > 0 ? { $and } : {};

        const tickets = await this.#ticketDAO.findAll(filters, params);
        const ticketsDTO = tickets?.docs?.map((ticket) => this.#ticketDAO.fromModel(ticket));
        tickets.docs = ticketsDTO;

        return tickets;
    }
}
