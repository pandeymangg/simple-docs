const UserModel = require('../models/userModel')
const jwt = require('jsonwebtoken')

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

exports.signup = async function(req, res) {
    try {
        const newUser = await UserModel.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
        })

        res.status(201).json({
            status: 'success',
            data: {
                user: newUser
            }
        })
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err.message
        })
    }
}

exports.login = async function (req, res) {
    try {

        const { email, password } = req.body

        // 1.)  CHECKING IF THE EMAIL AND PASSWORD EXISTS

        if(!email || !password) {
            res.status(400).json({
                status: 'fail',
                message: 'Please provide an email and a password!'
            })

            return;
        }

        // 2.)  CHECKING IF THE USER EXISTS
        
        const user = await UserModel.findOne({ email }).select('+password')

        if(!user || !(await user.correctPassword(password, user.password)) ) {
            res.status(401).json({
                status: "fail",
                message: "incorrect  email or password"
            })

            return;
        }

        // 3.) SIGN A JWT TOKEN:

        const token = signToken(user._id)

        // 4.) IF EVERYTHING IS OKAY, SEND THE TOKEN TO THE CLIENT:

        res.status(200).json({
            status: "success",
            token
        })


    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        })
    }
}