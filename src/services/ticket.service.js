import TicketRepository from "../repositories/ticket.repository.js";

export default class TicketService {
    #ticketRepository;

    constructor() {
        this.#ticketRepository = new TicketRepository();
    }

    async createTicket(ticketData) {
        const ticket = await this.#ticketRepository.create(ticketData);
        return ticket;
    }

    async findAllTickets(params) {
        const tickets = await this.#ticketRepository.findAll(params);
        return tickets;
    }
}
