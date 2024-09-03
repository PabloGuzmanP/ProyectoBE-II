export default class TicketDTO {
    fromData(ticketData) {
        return {
            code: ticketData.code,
            purchase_datetime: ticketData.purchase_datetime,
            amount: ticketData.amount,
            purchaser: ticketData.purchaser
        };
    }

    fromModel(ticketModel) {
        return {
            id: ticketModel.id,
            code: ticketModel.code,
            purchase_datetime: ticketModel.purchase_datetime,
            amount: ticketModel.amount,
            purchaser: ticketModel.purchaser
        };
    }
}
