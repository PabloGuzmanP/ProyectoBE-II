import bcrypt from "bcrypt";

export const createHash = (password) => {
    password = String(password);
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(password, salt);

    return hash;
};

export const isValidHash = (password, hash) => {
    password = String(password);
    return bcrypt.compareSync(password, hash);
};