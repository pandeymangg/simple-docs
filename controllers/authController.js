const UserModel = require('../models/userModel')
const DocModel = require('../models/docModel')
const jwt = require('jsonwebtoken')
const { promisify } = require('util')
const NotificationModel = require('../models/notificationModel')

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

        res.cookie('jwt', token, {
            expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
            httpOnly: true
        })

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

exports.logout = async function (req, res) {
    try {
        res.cookie('jwt', '', {
            expires: new Date(Date.now() + 2 * 1000),
            httpOnly: true
        })

        res.status(200).json({
            status: "success"
        })

    } catch (err) {
        res.status(400).json({
            status: "fail",
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
        const authCookie = req.cookies.jwt

        if (authHeader && authHeader.startsWith('Bearer')) {
            token = authHeader.split(' ')[1];
        } else if (authCookie) {
            token = authCookie
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


exports.isLoggedIn = async function (req, res) {
    try {
        //  TESTING USING BACKEND: 

        // const token = req.headers.cookie.split('=')[1]

        //  TESTING USING FRONTEND:

        const token = req.cookies.jwt

        if (token) {
            const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

            const currentUser = await UserModel.findById(decoded.id)

            if (!currentUser) {
                res.json({
                    status: "fail",
                    loggedIn: false
                })
                return
            }

            const isPasswordChanged = currentUser.isPasswordChanged(decoded.iat)

            if (isPasswordChanged) {
                res.json({
                    status: "fail",
                    loggedIn: false
                })
                return
            }

            res.status(200).json({
                status: "success",
                loggedIn: true,
                user: currentUser
            })

        } else {
            res.json({
                status: "fail",
                loggedIn: false
            })
        }


    } catch (err) {
        res.json(false)
    }
}

exports.getUser = async function (req, res) {
    try {
        //console.log(req.body)
        const user = await UserModel.findById(req.params.id)

        res.status(200).json({
            status: "success",
            username: user.username
        })

    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err.message
        })
    }
}

exports.getOwner = async function (req, res) {
    try {
        const doc = await DocModel.findById(req.params.docId)

        res.status(200).json({
            status: "success",
            owner: doc.owner
        })
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err.message
        })
    }
}


exports.isOwner = async function (req, res, next) {
    try {
        const doc = await DocModel.findById(req.params.id)

        if (!req.user._id.equals(doc.owner)) {
            res.status(400).json({
                status: "fail",
                message: "You are not authorised to perform this action!"
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

exports.isOwnerOrCollaborator = async function (req, res, next) {
    try {
        const doc = await DocModel.findById(req.params.id)

        if (!req.user._id.equals(doc.owner) && !doc.collaborators.includes(req.user._id)) {
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

exports.removeCollaborator = async function (req, res) {
    try {
        const doc = await DocModel.findById(req.params.id)

        if (!doc) {
            res.status(400).json({
                status: "fail",
                message: "no such document exists"
            })
            return
        }

        if (!doc.collaborators) {
            res.status(400).json({
                status: "fail",
                message: "This document does not have any collaborators!"
            })
            return
        }

        let collaboratorsArray = [...doc.collaborators]

        //console.log(collaboratorsArray)
        //const index = collaboratorsArray.indexOf(req.body.collabId)
        const index = collaboratorsArray.findIndex(id => id.equals(req.body.collabId))

        //console.log(index)

        if (index === -1) {
            res.status(400).json({
                status: "fail",
                message: "this user is not a collaborator"
            })
            return
        }

        collaboratorsArray.splice(index, 1)

        const updatedDoc = await DocModel.findByIdAndUpdate(req.params.id, {
            collaborators: collaboratorsArray
        }, { new: true })

        res.status(200).json({
            status: "success",
            doc: updatedDoc
        })


    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err.message
        })
    }
}

exports.acceptRequest = async function (req, res) {
    try {

        //const senderId = req.user._id
        const senderId = req.body.senderId
        const docId = req.params.docId

        const doc = await DocModel.findById(docId)
        const user = await UserModel.findById(senderId)

        if (!doc || !user) {
            res.status(400).json({
                status: "fail",
                message: "error"
            })
            return
        }

        if (user._id.equals(doc.owner)) {
            res.status(400).json({
                status: "fail",
                message: "you are already the owner!"
            })
            return
        }

        if (doc.collaborators.includes(user._id)) {
            res.status(400).json({
                status: "fail",
                message: "you are already a collaborator!"
            })
            return
        }

        const collaboratorsNew = [...doc.collaborators]
        collaboratorsNew.push(user._id)

        //console.log(collaboratorsNew)

        const updatedDoc = await DocModel.findByIdAndUpdate(docId, {
            collaborators: collaboratorsNew
        }, { new: true })

        res.status(200).json({
            status: "success",
            doc: updatedDoc
        })


    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err.message
        })
    }
}

exports.doesNotificationExist = async function (req, res, next) {
    try {

        const docId = req.body.docId
        const senderId = req.user._id

        const doc = await DocModel.findById(docId)

        // console.log(doc.owner.equals(senderId))
        // console.log(doc.owner.equals(req.user._id))

        if (doc.owner.equals(senderId) || doc.owner.equals(req.user._id)) {
            res.status(400).json({
                status: 'fail',
                message: 'you are already an owner'
            })

            return
        }

        if (!req.user._id.equals(senderId)) {
            res.status(400).json({
                status: "fail",
                message: "you are not the sender"
            })
            return
        }

        //const sender = await UserModel.findById(senderId)
        const sender = req.user

        if (!sender || !doc) {
            res.status(400).json({
                status: 'fail',
                message: 'no resource exists'
            })

            return
        }

        //const owner = await UserModel.findById(req.params.userId)
        const owner = await UserModel.findById(doc.owner)

        if (!owner) {
            res.status(400).json({
                status: "fail",
                message: "no user exists"
            })
            return
        }

        const notification = `User ${sender.username} has requested access for the document ${doc.name}`

        const newNotification = await NotificationModel.findOne({
            type: "access request",
            reciever: owner._id,
            sender: req.user._id,
            doc: docId,
            notification: notification
        })

        if(newNotification) {
            res.status(400).json({
                status: "fail",
                message: "Notification already exists"
            })

            return
        }

        req.doc = doc
        req.docOwner = owner
        next()

    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err.message
        })
    }
}

exports.createAccessNotification = async function (req, res) {
    try {

        const docId = req.body.docId
        const doc = req.doc
        const owner = req.docOwner
        const sender = req.user

        if (!owner) {
            res.status(400).json({
                status: "fail",
                message: "no user exists"
            })
            return
        }

        const notification = `User ${sender.username} has requested access for the document ${doc.name}`

        const newNotification = await NotificationModel.create({
            type: "access request",
            reciever: owner._id,
            sender: req.user._id,
            doc: docId,
            notification: notification
        })

        res.status(200).json({
            status: "success",
            notification: newNotification
        })

    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err.message
        })
    }
}

exports.getNotifications = async function (req, res) {
    try {

        //const notificationsArray = req.user.notifications
        //console.log(notificationsArray)

        const notifications = await NotificationModel.find({
            reciever: req.user._id
        })

        res.status(200).json({
            status: "success",
            results: notifications.length,
            notifications
        })

    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err.message
        })
    }
}

exports.deleteNotification = async function (req, res) {
    try {

        await NotificationModel.findByIdAndDelete(req.params.id)

        res.status(200).json({
            status: "success",
            message: "notification deleted!"
        })

    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err.message
        })
    }
}