const User = require('../datamodels/User');
const { sendError } = require('../utils/errorHandler');

async function getUserById(userId) {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('AUTH_002');
        }

        return user;
    } catch (error) {
        throw error;
    }
}

async function getUserByPhoneNumber(phoneNumber) {
    try {
        const user = await User.findOne({ phoneNumber });
        if(!user) {
            throw new Error('AUTH_002');
        }

        return user;
    } catch (error) {
        throw error;
    }
}

async function updateUserNameAndEmail(userId, fullName, email) {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('AUTH_002');
        }
        console.log(user);
        user.fullName = fullName || user.fullName;
        user.email = email || user.email;
        console.log(fullName, email);
        await user.save();
        return user;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getUserById,
    getUserByPhoneNumber,
    updateUserNameAndEmail
}