const { sendError } = require('../utils/errorHandler');

const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errorCode = error.details[0].message;

            return sendError(res, errorCode);
        }
        next();
    };
};

module.exports = { validateRequest };