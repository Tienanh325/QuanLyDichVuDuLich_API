const express = require("express");
const controller = require("../controllers/Admin_taikhoan");

const router = express.Router();

router.get("/taikhoan", controller.getAll);
router.get("/taikhoan/:id", controller.getById);
router.post("/taikhoan", controller.create);
router.put("/taikhoan/:id", controller.update);
router.delete("/taikhoan/:id", controller.remove);

module.exports = router;
