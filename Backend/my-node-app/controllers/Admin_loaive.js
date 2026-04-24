const model = require("../models/Admin_loaive");
const { createCrudController } = require("./Admin_resourceFactory");

module.exports = createCrudController(model, {
    notFoundMessage: "Loai ve not found"
});
