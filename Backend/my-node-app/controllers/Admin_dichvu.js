const model = require("../models/Admin_dichvu");
const { createCrudController } = require("./Admin_resourceFactory");

module.exports = createCrudController(model, {
    notFoundMessage: "Dich vu not found"
});
