const model = require("../models/Admin_khachsan");
const { createCrudController } = require("./Admin_resourceFactory");

module.exports = createCrudController(model, {
    notFoundMessage: "Khach san not found"
});
