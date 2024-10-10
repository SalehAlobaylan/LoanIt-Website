const express = require('express');
const { createLoan, getLoanById, getLoans } = require('../controllers/loan');
const { authenticate } = require('../middlewares/auth');
const { validateRequest } = require('../middlewares/validation');
const { createLoanSchema } = require('../validators/loanSchemas');
const router = express.Router({ mergeParams: true });

router.post('/', authenticate, validateRequest(createLoanSchema), createLoan);

router.get('/', authenticate, getLoans);

module.exports = router;