const express = require('express');
const { createLoan, getLoanById, getLoans } = require('../controllers/loan');
const { validateRequest } = require('../middlewares/validation');
const { createLoanSchema } = require('../validators/loanSchemas');
const router = express.Router();

router.post('/user/:userId/loans', validateRequest(createLoanSchema), createLoan);