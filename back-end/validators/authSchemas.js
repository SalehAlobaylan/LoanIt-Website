const Joi = require('joi');

const registerSchema = Joi.object({
    fullName: Joi.string()
        .min(3)
        .max(30)
        .required()
        .messages({
            'string.base': 'VAL_004', // Field cannot be empty (as a base type)
            'string.empty': 'VAL_004',
            'string.min': 'VAL_004', // Name does not meet length requirements
            'any.required': 'VAL_004' // Required field
        })
        .label('AUTH_004'),
    phoneNumber: Joi.string()
        .pattern(/^[0-9]{9,12}$/)
        .required()
        .messages({
            'string.base': 'VAL_001',
            'string.empty': 'VAL_001',
            'string.pattern.base': 'VAL_001',
            'any.required': 'VAL_001'
        })
        .label('AUTH_003'),
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'VAL_002',
            'string.empty': 'VAL_002',
            'any.required': 'VAL_002'
        })
        .label('AUTH_005'),
    password: Joi.string()
        .min(6)
        .max(30)
        .required()
        .messages({
            'string.min': 'VAL_003',
            'string.empty': 'VAL_003',
            'any.required': 'VAL_003'
        })
        .label('AUTH_001')
});

const loginSchema = Joi.object({
    phoneNumber: Joi.string()
        .pattern(/^[0-9]{9,12}$/)
        .required()
        .messages({
            'string.base': 'VAL_001',
            'string.empty': 'VAL_001',
            'string.pattern.base': 'VAL_001',
            'any.required': 'VAL_001'
        })
        .label('AUTH_001'),
    password: Joi.string()
        .min(6)
        .max(30)
        .required()
        .messages({
            'string.min': 'VAL_003',
            'string.empty': 'VAL_003',
            'any.required': 'VAL_003'
        })
        .label('AUTH_001')
});

module.exports = { registerSchema, loginSchema };
