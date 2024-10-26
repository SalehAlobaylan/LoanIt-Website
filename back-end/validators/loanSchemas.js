const Joi = require('joi');

const createLoanSchema = Joi.object({
    partyPhoneNumber: Joi.string()
        .pattern(/^[0-9]{9,12}$/)
        .required()
        .messages({
            'string.pattern.base': 'VAL_001', // Invalid phone number format
            'any.required': 'VAL_001', // Phone number is required
        }),
    role: Joi.string()
        .valid('BORROWER', 'LENDER')
        .required()
        .messages({
            'any.only': 'LOAN_003', // Invalid loan status or role
            'any.required': 'LOAN_003' // Role is required
        }),
    title: Joi.string()
        .min(3)
        .max(100)
        .required()
        .messages({
            'string.base': 'VAL_004', // Field cannot be empty
            'string.empty': 'VAL_004', // Field cannot be empty
            'any.required': 'VAL_006' // Title is required
        }),
    amount: Joi.number()
        .positive()
        .max(10000000000) // Max value validation
        .precision(2)
        .required()
        .messages({
            'number.base': 'LOAN_005', // Invalid loan amount format
            'number.positive': 'LOAN_005', // Loan amount must be positive
            'number.max': 'LOAN_005', // Loan amount exceeds the maximum allowed
            'any.required': 'LOAN_005' // Amount is required
        }),
    date: Joi.date()
        .iso()
        .required()
        .messages({
            'date.base': 'VAL_005', // Invalid date format
            'date.format': 'VAL_005', // Date must be in ISO format
            'any.required': 'VAL_005' // Date is required
        }),
    notes: Joi.string()
        .optional()
        .allow(null, '')
        .messages({
            'string.base': 'VAL_004' // Notes must be a string if provided
        })
});

module.exports = { createLoanSchema };
