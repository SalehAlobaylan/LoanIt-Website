const { updateUserController } = require('../controllers/user');

const express = require('express');
const router = express.Router({ mergeParams: true });

router.patch('', updateUserController);

module.exports = router;