const UserModel = require('../models/userModel')
const DocModel = require('../models/docModel')
const jwt = require('jsonwebtoken')
const { promisify } = require('util')

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

exports.signup = async function (req, res) {
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

        if (!email || !password) {
            res.status(400).json({
                status: 'fail',
                message: 'Please provide an email and a password!'
            })

            return;
        }

        // 2.)  CHECKING IF THE USER EXISTS

        const user = await UserModel.findOne({ email }).select('+password')

        if (!user || !(await user.correctPassword(password, user.password))) {
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

exports.protect = async function (req, res, next) {
    try {
        //  1.)  GETTING THE TOKEN AND CHECKING IF IT IS THERE

        //let token;
        let token;

        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer')) {
            token = authHeader.split(' ')[1];
        }

        //console.log(token)

        if (!token) {
            res.status(400).json({
                status: "fail",
                message: "You are not logged in!"
            })

            return;
        }


        //   2.)  VALIDATE THE TOKEN

        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
        //console.log(decoded)

        //  3.)  CHECK IF THE USER STILL EXISTS

        const freshUser = await UserModel.findById(decoded.id);
        if (!freshUser) {
            res.status(401).json({
                status: "fail",
                message: "The user with this token no longer exists"
            })

            return;
        }

        // 4.)  CHECK IF THE USER CHANGED PASSWORD AFTER THE TOKEN WAS ISSUED

        const isPasswordChanged = freshUser.isPasswordChanged(decoded.iat)

        if (isPasswordChanged) {
            res.status(400).json({
                status: "fail",
                message: "User recently changed password. Please log in again!"
            })

            return;
        }


        //  IF EVERYTHING IS FINE, GIVE THE USER ACCESS: 

        req.user = freshUser
        next();

    } catch (err) {
        res.status(400).json({
            status: 'fail',
            err,
            messgae: err.message
        })
    }
}

exports.isOwner = async function (req, res, next) {
    try {
        const doc = await DocModel.findById(req.params.id)

        if (!req.user._id.equals(doc.owner)) {
            res.status(400).json({
                status: "fail",
                message: "You are not authorised to access this document!"
            })

            return
        }

        next()
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err.message
        })
    }
}