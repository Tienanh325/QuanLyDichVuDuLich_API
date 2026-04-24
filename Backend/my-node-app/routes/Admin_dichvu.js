const express = require("express");
const controller = require("../controllers/Admin_dichvu");

const router = express.Router();

router.get("/dichvu", controller.getAll);
router.get("/dichvu/:id", controller.getById);
router.post("/dichvu", controller.create);
router.put("/dichvu/:id", controller.update);
router.delete("/dichvu/:id", controller.remove);

module.exports = router;
