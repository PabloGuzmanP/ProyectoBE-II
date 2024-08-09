import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";
import { USER, ROLES } from "../constants/roles.constant.js";

const userSchema = new Schema({
    first_name:{
        type: String,
        required: [ true, "El nombre es obligatorio" ],
        uppercase: true,
        trim: true,
    },
    last_name:{
        type: String,
        required: [ true, "El apellido es obligatorio" ],
        uppercase: true,
        trim: true,
    },
    email:{
        type: String,
        required: [ true, "El email es obligatorio" ],
        lowercase: true,
        trim: true,
        unique: true,
        validate: {
            validator: async function (email) {
                const countDocuments = await this.model("users").countDocuments({
                    _id: { $ne: this._id },
                    email, // Atributo de verificación de duplicado
                });
                return countDocuments === 0;
            },
            message: "El email ya está registrado",
        },
    },
    age:{
        type: Number,
        required: [ true, "La edad es obligatoria" ],
    },
    password:{
        type: String,
        required: [ true, "La contraseña es obligatoria" ],
    },
    cart: {
        type: Schema.Types.ObjectId, 
        ref: "carts",
        required: true,
    },
    role: {
        type: [String],
        uppercase: true,
        enum: {
            values: ROLES,
            message: "Rol no válido",
        },
        default: [USER], // El valor por defecto es "USER"
    },
}, {
    timestamps: true,
    versionKey: false,
});

userSchema.plugin(paginate);

const UserModel = model("users", userSchema);

export default UserModel;