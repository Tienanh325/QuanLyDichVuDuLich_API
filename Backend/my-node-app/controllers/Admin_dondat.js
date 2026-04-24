const model = require("../models/Admin_dondat");
const { createCrudController, handleError } = require("./Admin_resourceFactory");

const baseController = createCrudController(model, {
    notFoundMessage: "Don dat not found"
});

const getDetails = async (req, res) => {
    try {
        const data = await model.getDetails(req.params.id);
        res.json(data);
    } catch (error) {
        handleError(res, error);
    }
};

module.exports = {
    ...baseController,
    getDetails
};
