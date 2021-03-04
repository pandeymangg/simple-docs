const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "username is a required field!"],
        unique: [true, "username already exists!"]
    },
    email: {
        type: String,
        required: [true, "email is a required field!"],
        unique: [true, "email already exists!"]
    },
    password: {
        type: String,
        minlength: [8, "password too short, must be atleast 8 characters long!"],
        required: [true, "password is a required field!"],
    },
    passwordConfirm: {
        type: String,
        required: [true, "passwordConfirm is a required field"]
    }
})

const UserModel = mongoose.model('UserModel', userSchema)

module.exports = UserModel