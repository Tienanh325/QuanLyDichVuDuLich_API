const model = require("../models/Admin_taikhoan");
const { createCrudController } = require("./Admin_resourceFactory");

module.exports = createCrudController(model, {
    notFoundMessage: "Tai khoan not found"
});
