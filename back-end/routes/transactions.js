const transactionController = require('../controllers/transaction');
const { authenticate } = require('../middlewares/auth');
const { validateRequest } = require('../middlewares/validation');
const { createTransactionSchema } = require('../validators/transactionSchemas.js');

const express = require('express');
const router = express.Router({ mergeParams: true });

// Route to get all transactions by user ID
router.get('/', transactionController.getTransactions);

// Route to create a transaction
router.post('/', transactionController.createTransactionController);

router.delete('/:transactionId', transactionController.deleteTransactionController);

module.exports = router;