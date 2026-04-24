const model = require("../models/Admin_thanhtoan");
const { createCrudController } = require("./Admin_resourceFactory");

module.exports = createCrudController(model, {
    notFoundMessage: "Thanh toan not found"
});
