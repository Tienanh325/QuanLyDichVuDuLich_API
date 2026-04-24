const model = require("../models/Admin_danhgia");
const { createCrudController } = require("./Admin_resourceFactory");

module.exports = createCrudController(model, {
    notFoundMessage: "Danh gia not found"
});
