const jwt = require("jsonwebtoken");
const model = require("../models/admin");

const JWT_SECRET = process.env.JWT_SECRET || "travel-admin-secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "8h";

const mapSqlError = (error) => {
    if (error.status) {
        return {
            status: error.status,
            message: error.message,
            details: error.details
        };
    }

    if (error.number === 547) {
        return {
            status: 409,
            message: "Record is referenced by other data, action cannot be completed"
        };
    }

    if (error.number === 2601 || error.number === 2627) {
        return {
            status: 409,
            message: "Duplicate data detected"
        };
    }

    return {
        status: 500,
        message: error.message || "Internal server error"
    };
};

const handleError = (res, error) => {
    const mappedError = mapSqlError(error);
    res.status(mappedError.status).json({
        message: mappedError.message,
        details: mappedError.details || null
    });
};

const login = async (req, res) => {
    try {
        const admin = await model.authenticateAdmin(req.body || {});
        const token = jwt.sign(
            {
                accID: admin.accID,
                maAdmin: admin.maAdmin,
                tenDangNhap: admin.tenDangNhap,
                vaiTro: admin.vaiTro
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.json({
            token,
            admin
        });
    } catch (error) {
        handleError(res, error);
    }
};

const getDashboard = async (req, res) => {
    try {
        const data = await model.getDashboard();
        res.json(data);
    } catch (error) {
        handleError(res, error);
    }
};

const getLookups = async (req, res) => {
    try {
        const data = await model.getLookups();
        res.json(data);
    } catch (error) {
        handleError(res, error);
    }
};

const getOrderBundle = async (req, res) => {
    try {
        const data = await model.getOrderBundle(req.params.id);
        res.json(data);
    } catch (error) {
        handleError(res, error);
    }
};

const listResource = (resourceKey) => async (req, res) => {
    try {
        const data = await model.listResource(resourceKey, req.query || {});
        res.json(data);
    } catch (error) {
        handleError(res, error);
    }
};

const getResourceById = (resourceKey) => async (req, res) => {
    try {
        const data = await model.getResourceById(resourceKey, req.params.id);
        res.json(data);
    } catch (error) {
        handleError(res, error);
    }
};

const createResource = (resourceKey) => async (req, res) => {
    try {
        const data = await model.createResource(resourceKey, req.body || {});
        res.status(201).json(data);
    } catch (error) {
        handleError(res, error);
    }
};

const updateResource = (resourceKey) => async (req, res) => {
    try {
        const data = await model.updateResource(resourceKey, req.params.id, req.body || {});
        res.json(data);
    } catch (error) {
        handleError(res, error);
    }
};

const deleteResource = (resourceKey) => async (req, res) => {
    try {
        const data = await model.deleteResource(resourceKey, req.params.id);
        res.json({
            message: "Deleted successfully",
            data
        });
    } catch (error) {
        handleError(res, error);
    }
};

module.exports = {
    login,
    getDashboard,
    getLookups,
    getOrderBundle,
    listResource,
    getResourceById,
    createResource,
    updateResource,
    deleteResource
};
