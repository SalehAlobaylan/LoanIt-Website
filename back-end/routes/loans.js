const loanController = require('../controllers/loan');
const { authenticate } = require('../middlewares/auth');
const { validateRequest } = require('../middlewares/validation');
const { createLoanSchema } = require('../validators/loanSchemas');

const express = require('express');
const router = express.Router({ mergeParams: true });
// Route to create a loan
router.post('/', validateRequest(createLoanSchema), loanController.createLoan);

// Route to get a loan by ID
router.get('/:loanId', loanController.getLoanById);

// Route to get all loans by user ID
router.get('/', loanController.getLoans);

// Route to update loan status (approve or reject)
router.patch('/:loanId', loanController.updateLoanStatus);

// Route to hide a loan
router.patch('/:loanId/hide', loanController.hideLoan);

module.exports = router;