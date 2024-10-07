const mongoose = require('mongoose');
//  1-Full name 2- Phone number 3-Password
const Schema = mongoose.Schema;
const UserSchema = new Schema({

    fullName: { type: String, required: true, unqiue: true },
    phoneNumber: { type: String, required: true, unqiue: true },
    email: { type: String, required: true, unqiue: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },

})


module.exports = mongoose.model('User', UserSchema);