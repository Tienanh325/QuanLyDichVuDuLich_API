const model = require("../models/Admin_ve");
const { createCrudController } = require("./Admin_resourceFactory");

module.exports = createCrudController(model, {
    notFoundMessage: "Ve not found"
});
