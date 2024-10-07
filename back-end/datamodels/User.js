const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
//  1-Full name 2- Phone number 3-Password
const Schema = mongoose.Schema;
const UserSchema = new Schema({

    fullName: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },

})

UserSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

module.exports = mongoose.model('User', UserSchema);