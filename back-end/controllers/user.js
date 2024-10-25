// build the full code
const { updateUserNameAndEmail } = require('../services/userService');
const { sendError } = require('../utils/errorHandler');

const updateUserController = async (req, res, next) => {
    const { userId } = req.params;
    const { fullName, email } = req.body;

    try {
        const user = await updateUserNameAndEmail(userId, fullName, email);
        res.status(204).send();
    } catch (error) {
        sendError(res, error.message);
        next(error);
    }
}

module.exports = {
    updateUserController
};
