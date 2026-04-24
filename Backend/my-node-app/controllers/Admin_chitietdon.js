const model = require("../models/Admin_chitietdon");
const { createCrudController } = require("./Admin_resourceFactory");

module.exports = createCrudController(model, {
    notFoundMessage: "Chi tiet don not found"
});
