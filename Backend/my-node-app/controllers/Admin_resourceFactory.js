const mapSqlError = (error) => {
    if (error.status) {
        return {
            status: error.status,
            message: error.message,
            details: error.details
        };
    }

    if (error.number === 547) {
        return {
            status: 409,
            message: "Record is referenced by other data, action cannot be completed"
        };
    }

    if (error.number === 2601 || error.number === 2627) {
        return {
            status: 409,
            message: "Duplicate data detected"
        };
    }

    return {
        status: 500,
        message: error.message || "Internal server error"
    };
};

const handleError = (res, error) => {
    const mappedError = mapSqlError(error);

    res.status(mappedError.status).json({
        message: mappedError.message,
        details: mappedError.details || null
    });
};

const createCrudController = (model, options = {}) => {
    const notFoundMessage = options.notFoundMessage || "Record not found";

    const getAll = async (req, res) => {
        try {
            const data = await model.getAll(req.query || {});
            res.json(data);
        } catch (error) {
            handleError(res, error);
        }
    };

    const getById = async (req, res) => {
        try {
            const data = await model.getById(req.params.id);

            if (!data) {
                return res.status(404).json({ message: notFoundMessage });
            }

            res.json(data);
        } catch (error) {
            handleError(res, error);
        }
    };

    const create = async (req, res) => {
        try {
            const data = await model.create(req.body || {});
            res.status(201).json(data);
        } catch (error) {
            handleError(res, error);
        }
    };

    const update = async (req, res) => {
        try {
            const data = await model.update(req.params.id, req.body || {});

            if (!data) {
                return res.status(404).json({ message: notFoundMessage });
            }

            res.json(data);
        } catch (error) {
            handleError(res, error);
        }
    };

    const remove = async (req, res) => {
        try {
            const data = await model.remove(req.params.id);

            if (!data) {
                return res.status(404).json({ message: notFoundMessage });
            }

            res.json(data);
        } catch (error) {
            handleError(res, error);
        }
    };

    return {
        getAll,
        getById,
        create,
        update,
        remove
    };
};

module.exports = {
    createCrudController,
    handleError
};
