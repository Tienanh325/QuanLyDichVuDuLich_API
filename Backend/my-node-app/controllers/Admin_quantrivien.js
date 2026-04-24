const model = require("../models/Admin_quantrivien");
const { createCrudController } = require("./Admin_resourceFactory");

module.exports = createCrudController(model, {
    notFoundMessage: "Quan tri vien not found"
});
