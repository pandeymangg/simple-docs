const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
    type: String,
    recieverId: {
        type: mongoose.Schema.ObjectId,
        ref: "UserModel"
    },
    senderId: {
        type: mongoose.Schema.ObjectId,
        ref: "UserModel"
    },
    docId: {
        type: mongoose.Schema.ObjectId,
        ref: "DocModel"
    },
    notification: {
        type: String,
        required: true
    }
})

const NotificationModel = mongoose.model('NotificationModel', notificationSchema)
module.exports = NotificationModel