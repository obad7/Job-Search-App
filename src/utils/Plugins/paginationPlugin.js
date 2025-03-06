/**
 * This JavaScript code defines a pagination plugin for Mongoose, 
 * a MongoDB ORM. It takes a Mongoose schema as input and adds a paginate method to the schema's query object. 
 * The paginate method returns a paginated result set, including the data for the current page, total items, 
 * current page number, total pages, and items per page. The page size is fixed at 5 items per page.
 */
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
