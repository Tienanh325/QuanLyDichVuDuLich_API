const express = require("express");
const controller = require("../controllers/Admin_chitietdon");

const router = express.Router();

router.get("/chitietdon", controller.getAll);
router.get("/chitietdon/:id", controller.getById);
router.post("/chitietdon", controller.create);
router.put("/chitietdon/:id", controller.update);
router.delete("/chitietdon/:id", controller.remove);

module.exports = router;
