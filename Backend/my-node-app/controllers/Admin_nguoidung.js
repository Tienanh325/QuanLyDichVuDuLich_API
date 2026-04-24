const model = require("../models/Admin_nguoidung");
const { createCrudController } = require("./Admin_resourceFactory");

module.exports = createCrudController(model, {
    notFoundMessage: "Nguoi dung not found"
});
