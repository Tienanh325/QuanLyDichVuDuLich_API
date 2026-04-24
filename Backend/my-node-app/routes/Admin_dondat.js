const express = require("express");
const controller = require("../controllers/Admin_dondat");

const router = express.Router();

router.get("/dondat", controller.getAll);
router.get("/dondat/:id/chitiet", controller.getDetails);
router.get("/dondat/:id", controller.getById);
router.post("/dondat", controller.create);
router.put("/dondat/:id", controller.update);
router.delete("/dondat/:id", controller.remove);

module.exports = router;
