export default class MongoDAO {
    #model;

    constructor(model){
        this.#model = model;
    }

    async findAll(filters, params) {
        const sort = {
            asc: { title: 1 },
            desc: { title: -1 },
        };

        const paginationOptions = {
            limit: params?.limit ?? 10,
            page: params?.page ?? 1,
            sort: sort[params?.sort] ?? {},
            populate: params?.populate ?? "",
            lean: true,
        };

        return await this.#model.paginate(filters, paginationOptions);
    }

    async findOneById(id){
        return await this.#model.findOne({ _id: id });
    }

    async findOneByCriteria(criteria){
        return await this.#model.find(criteria);
    }

    async save(data) {
        if(data.id){
            return await this.#model.findByIdAndUpdate(data.id, data, { runValidators: true });
        } else {
            const object = new this.#model(data);
            return await object.save();
        }
    }

    async deleteOneById(id){
        return await this.#model.deleteOne({ _id: id });
    }

    async deleteMany(criteria = {}) {
        return await this.#model.deleteMany(criteria);
    }
}