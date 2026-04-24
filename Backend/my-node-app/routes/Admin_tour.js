const express = require("express");
const controller = require("../controllers/Admin_tour");

const router = express.Router();

router.get("/tour", controller.getAll);
router.get("/tour/:id", controller.getById);
router.post("/tour", controller.create);
router.put("/tour/:id", controller.update);
router.delete("/tour/:id", controller.remove);

module.exports = router;
