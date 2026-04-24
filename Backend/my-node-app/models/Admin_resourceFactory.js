const adminModel = require("./admin");

const createResourceModel = (resourceKey) => ({
    getAll: (query = {}) => adminModel.listResource(resourceKey, query),
    getById: (id) => adminModel.getResourceById(resourceKey, id),
    create: (payload) => adminModel.createResource(resourceKey, payload),
    update: (id, payload) => adminModel.updateResource(resourceKey, id, payload),
    remove: (id) => adminModel.deleteResource(resourceKey, id)
});

module.exports = {
    createResourceModel
};
