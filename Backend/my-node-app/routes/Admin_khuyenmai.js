const express = require("express");
const controller = require("../controllers/Admin_khuyenmai");

const router = express.Router();

router.get("/khuyenmai", controller.getAll);
router.get("/khuyenmai/:id", controller.getById);
router.post("/khuyenmai", controller.create);
router.put("/khuyenmai/:id", controller.update);
router.delete("/khuyenmai/:id", controller.remove);

module.exports = router;
