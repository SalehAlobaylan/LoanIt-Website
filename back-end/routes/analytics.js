const express = require('express');
const { analyticsController } = require('../controllers/analytics');
const { validateRequest } = require('../middlewares/validation');


const router = express.Router({ mergeParams: true });

router.get('', analyticsController);


module.exports = router;