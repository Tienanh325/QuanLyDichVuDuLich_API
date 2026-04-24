const express = require("express");
const controller = require("../controllers/Admin_danhgia");

const router = express.Router();

router.get("/danhgia", controller.getAll);
router.get("/danhgia/:id", controller.getById);
router.post("/danhgia", controller.create);
router.put("/danhgia/:id", controller.update);
router.delete("/danhgia/:id", controller.remove);

module.exports = router;
