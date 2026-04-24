const express = require("express");
const controller = require("../controllers/Admin_nguoidung");

const router = express.Router();

router.get("/nguoidung", controller.getAll);
router.get("/nguoidung/:id", controller.getById);
router.post("/nguoidung", controller.create);
router.put("/nguoidung/:id", controller.update);
router.delete("/nguoidung/:id", controller.remove);

module.exports = router;
