const express = require("express");
const controller = require("../controllers/Admin_khachsan");

const router = express.Router();

router.get("/khachsan", controller.getAll);
router.get("/khachsan/:id", controller.getById);
router.post("/khachsan", controller.create);
router.put("/khachsan/:id", controller.update);
router.delete("/khachsan/:id", controller.remove);

module.exports = router;
