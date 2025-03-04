const paginationPlugin = (schema) => {
    schema.query.paginate = async function (page) {
        page = page ? page : 1;
        const limit = 5;
        const skip = (page - 1) * limit;

        // data, currentPage, totalitems, totalPages, itemsPerPage
        const data = await this.skip(skip).limit(limit);
        const totalItems = await this.model.countDocuments(this.getQuery());

        return {
            data,
            totalItems,
            currentPage: Number(page),
            totalPages: Math.ceil(totalItems / limit),
            itemsPerPage: data.length,
        }
    };
};

export default paginationPlugin;
