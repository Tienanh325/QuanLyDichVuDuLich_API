const express = require("express");
const controller = require("../controllers/Admin_thanhtoan");

const router = express.Router();

router.get("/thanhtoan", controller.getAll);
router.get("/thanhtoan/:id", controller.getById);
router.post("/thanhtoan", controller.create);
router.put("/thanhtoan/:id", controller.update);
router.delete("/thanhtoan/:id", controller.remove);

module.exports = router;
