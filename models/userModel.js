const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

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
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, "passwordConfirm is a required field"],
        validate: {
            validator: function (currElement) {
                return currElement === this.password
            },
            message: "Fields do not match!"
        }
    }
})

userSchema.pre('save', async function (next) {

    //  ONLY DOING THIS WHEN THE PASSWORD FIELD IS MODIFIED (NEW OR EDITED)

    if (!this.isModified('password')) {
        return
    }

    this.password = await bcrypt.hash(this.password, 12)

    this.passwordConfirm = undefined
    next()
})

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.isPasswordChanged = function (timeStamp) {
    if (!this.passwordChangedAt) {
        return
    }
    const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000);

    if (this.passwordChangedAt) {
        //console.log(changedTimeStamp, timeStamp)
        return timeStamp < changedTimeStamp
    }

    return false;
}

const UserModel = mongoose.model('UserModel', userSchema)

module.exports = UserModel