const model = require("../models/Admin_khuyenmai");
const { createCrudController } = require("./Admin_resourceFactory");

module.exports = createCrudController(model, {
    notFoundMessage: "Khuyen mai not found"
});
