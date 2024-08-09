import { connect, Types } from "mongoose";

const connectDB = () => {
    connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Conectado a MongoDB"))
    .catch((error) => console.error("Fallo en la conexion a MonogoDB"));
};

const isValidID = (id) => {
    return Types.ObjectId.isValid(id);
};

export default {
    connectDB,
    isValidID
};