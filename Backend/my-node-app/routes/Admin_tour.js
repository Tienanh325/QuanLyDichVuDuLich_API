const express = require('express');
const router = express.Router();
const TourController = require('../controllers/Admin_tour');

router.get('/tours', TourController.getAll);
router.get('/tours/:id', TourController.getById);
router.post('/tours', TourController.create);
router.put('/tours/:id', TourController.update);
router.delete('/tours/:id', TourController.remove);

module.exports = router;
