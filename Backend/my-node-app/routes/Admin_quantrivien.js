const express = require("express");
const controller = require("../controllers/Admin_quantrivien");

const router = express.Router();

router.get("/quantrivien", controller.getAll);
router.get("/quantrivien/:id", controller.getById);
router.post("/quantrivien", controller.create);
router.put("/quantrivien/:id", controller.update);
router.delete("/quantrivien/:id", controller.remove);

module.exports = router;
