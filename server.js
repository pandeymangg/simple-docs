const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const path = require('path')

dotenv.config({ path: "./config.env" })

const { getAllDocs, createNewDocument, getSingleDoc, updateDoc, deleteDoc, doesDocExist } = require('./controllers/docController')

const { signup, login, protect, isOwnerOrCollaborator, isLoggedIn, logout, acceptRequest, isCollaborator, isOwner, createAccessNotification, getOwner, getNotifications, deleteNotification, getUser, removeCollaborator } = require('./controllers/authController')


const DB = process.env.DB.replace(
    '<password>',
    process.env.DB_PASS
)

// mongoose.connect('mongodb://localhost/test-db', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
//     .then(() => console.log('DB connection successful!'))

mongoose.connect(DB, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(() => console.log('DB connection successful!'))


app.use(cookieParser())

app.use(express.json())

app.get('/api/docs', protect, getAllDocs)

app.get('/api/docs/:id', protect, isOwnerOrCollaborator, getSingleDoc)

app.post('/api/docs', protect, doesDocExist, createNewDocument)

app.patch('/api/docs/:id', protect, isOwnerOrCollaborator, doesDocExist, updateDoc)

app.patch('/api/docs/:id/removeCollaborator', protect, isOwner, removeCollaborator)

app.delete('/api/docs/:id', protect, isOwner, deleteDoc)

app.get('/api/docs/getOwner/:docId', protect, getOwner)

//app.post('/api/users/:userId/notifications/requestAccess', protect, createAccessNotification)
app.post('/api/users/signup', signup)

app.post('/api/users/login', login)

app.get('/api/users/getUser/:id', protect, getUser)

app.get('/api/users/isLoggedIn', isLoggedIn)

app.get('/api/users/logout', logout)

app.post('/api/users/notifications/requestAccess', protect, createAccessNotification)

app.get('/api/users/notifications', protect, getNotifications)

app.post('/api/users/:docId', protect, acceptRequest)

app.delete('/api/notifications/:id', protect, deleteNotification)


if (process.env.NODE_ENV === "production") {
    app.use(express.static('client/build'))

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })

}


const port = process.env.PORT || 8000
app.listen(port, () => {
    console.log(`server started at port: ${port}`)
})

// app.listen(port, () => {
//     console.log(`server started at port: ${port}`)
// })