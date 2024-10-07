const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../datamodels/User');
const { sendError } = require('../config/errorHandler');

const register = async (req, res, next) => {
    const { fullName, phoneNumber, email, password } = req.body;

    try {

        const existingUser = await User.findOne({
            $or: [{ fullName }, { phoneNumber }, { email }]
        });

        if (existingUser) {
            if (existingUser.fullName === fullName) {
                return sendError(res, 'AUTH_004');
            } else if (existingUser.phoneNumber === phoneNumber) {
                return sendError(res, 'AUTH_003');
            } else if (existingUser.email === email) {
                return sendError(res, 'AUTH_005');
            } else {
                return sendError(res, 'AUTH_001');
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ fullName, phoneNumber, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ user });
    } catch (error) {
        next(error);
    }
}

const login = async (req, res, next) => {
    const { phoneNumber, password } = req.body;

    try {
        const user = await User.findOne({ phoneNumber });
        if (!user) {
            return sendError(res, 'AUTH_002');
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return sendError(res, 'AUTH_001');
        }

        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1w' });
        const userObject = user.toObject();

        delete userObject.password;

        res.json({ ...userObject, token });
    } catch (error) {
        next(error);
    }
};

module.exports = { register, login };