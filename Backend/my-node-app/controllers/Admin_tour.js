const model = require("../models/Admin_tour");
const { createCrudController } = require("./Admin_resourceFactory");

module.exports = createCrudController(model, {
    notFoundMessage: "Tour not found"
});
