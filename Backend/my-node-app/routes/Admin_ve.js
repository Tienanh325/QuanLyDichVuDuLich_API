const express = require("express");
const controller = require("../controllers/Admin_ve");

const router = express.Router();

router.get("/ve", controller.getAll);
router.get("/ve/:id", controller.getById);
router.post("/ve", controller.create);
router.put("/ve/:id", controller.update);
router.delete("/ve/:id", controller.remove);

module.exports = router;
