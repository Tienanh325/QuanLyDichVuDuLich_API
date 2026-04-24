const adminModel = require("./admin");
const { createResourceModel } = require("./Admin_resourceFactory");

module.exports = {
    ...createResourceModel("orders"),
    getDetails: (id) => adminModel.getOrderBundle(id)
};
