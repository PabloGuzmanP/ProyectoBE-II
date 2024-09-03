import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { v4 as uuidv4 } from "uuid";

const ticketSchema = new Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        default: () => uuidv4()
    },
    purchase_datetime: {
        type: Date,
        required: true,
        default: Date.now
    },
    amount: {
        type: Number,
        required: true
    },
    purchaser: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    }
});

ticketSchema.plugin(mongoosePaginate);

const TicketModel = model("tickets", ticketSchema);

export default TicketModel;