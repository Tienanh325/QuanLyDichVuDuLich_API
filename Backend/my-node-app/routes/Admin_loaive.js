const express = require("express");
const controller = require("../controllers/Admin_loaive");

const router = express.Router();

router.get("/loaive", controller.getAll);
router.get("/loaive/:id", controller.getById);
router.post("/loaive", controller.create);
router.put("/loaive/:id", controller.update);
router.delete("/loaive/:id", controller.remove);

module.exports = router;
