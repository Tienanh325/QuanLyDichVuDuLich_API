const express = require('express');
const router = express.Router();
const DichVuController = require('../controllers/Admin_dichvu');

router.get('/dichvu', DichVuController.getAll);
router.get('/dichvu/:id', DichVuController.getById);
router.post('/dichvu', DichVuController.create);
router.put('/dichvu/:id', DichVuController.update);
router.delete('/dichvu/:id', DichVuController.remove);

module.exports = router;
