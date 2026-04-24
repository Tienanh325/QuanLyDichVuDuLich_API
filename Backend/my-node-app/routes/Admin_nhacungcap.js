const express = require("express");
const router = express.Router();
const controller = require("../controllers/nhacungcap.controller");

router.get("/nhacungcap", controller.getAll);
router.get("/nhacungcap/:id", controller.getById);
router.post("/nhacungcap", controller.create);
router.put("/nhacungcap/:id", controller.update);
router.delete("/nhacungcap/:id", controller.remove);

module.exports = router;