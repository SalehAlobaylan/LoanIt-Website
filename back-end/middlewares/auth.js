const jwt = require('jsonwebtoken');
const User = require('../datamodels/User');
const { sendError } = require('../config/errorHandler');

const authenticate = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return sendError(res, 'AUTH_006');
    }

    try {
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById(decodedToken.userId);
        if (!user) {
            return sendError(res, 'AUTH_002');
        }

        req.user = user;
        next();
    } catch (error) {
        sendError(res, 'AUTH_007');
    }
}

module.exports = authenticate;