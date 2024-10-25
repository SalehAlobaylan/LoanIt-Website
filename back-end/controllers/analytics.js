const { analyticsService } = require('../services/analytics');
const { sendError } = require('../utils/errorHandler');

// make analytics about number of loans, how much you owe, how much you are owed
const analyticsController = async (req, res, next) => {
    const { userId } = req.params;

    try {
        const analytics = await analyticsService(userId);
        res.json({ data: analytics });
    } catch (error) {
        sendError(res, error.message);
        next(error);
    }
}

module.exports = {
    analyticsController
};
