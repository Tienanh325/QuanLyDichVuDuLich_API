const model = require("../models/Admin_nhacungcap");

const getAll = async (req, res) => {
    try {
        const data = await model.getAll();
        res.json(data);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const getById = async (req, res) => {
    try {
        const data = await model.getById(req.params.id);
        if (!data) {
            return res.status(404).json({ message: "Supplier not found" });
        }

        res.json(data);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const create = async (req, res) => {
    try {
        const created = await model.create(req.body);
        res.status(201).json(created);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const update = async (req, res) => {
    try {
        const updated = await model.update(req.params.id, req.body);
        if (!updated) {
            return res.status(404).json({ message: "Supplier not found" });
        }

        res.json(updated);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const remove = async (req, res) => {
    try {
        const deleted = await model.remove(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: "Supplier not found" });
        }

        res.json(deleted);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};
