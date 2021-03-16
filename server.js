const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')

dotenv.config({ path: "./config.env" })

const { getAllDocs, createNewDocument, getSingleDoc, updateDoc, deleteDoc, doesDocExist } = require('./controllers/docController')

const { signup, login, protect, isOwnerOrCollaborator, isLoggedIn, logout, acceptRequest, isCollaborator, isOwner, createAccessNotification, getOwner, getNotifications } = require('./controllers/authController')


mongoose.connect('mongodb://localhost/test-db', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(() => console.log('DB connection successful!'))

app.use(cookieParser())

app.use(express.json())

app.get('/api/docs', protect, getAllDocs)

app.get('/api/docs/:id', protect, isOwnerOrCollaborator, getSingleDoc)

app.post('/api/docs', protect, doesDocExist, createNewDocument)

app.patch('/api/docs/:id', protect, isOwnerOrCollaborator, updateDoc)

app.delete('/api/docs/:id', protect, isOwner, deleteDoc)

app.get('/api/docs/getOwner/:docId', protect, getOwner)

app.post('/api/users/:userId/notifications/requestAccess', protect, createAccessNotification)

app.get('/api/users/notifications', protect, getNotifications)

app.post('/api/users/signup', signup)

app.post('/api/users/login', login)

app.get('/api/users/isLoggedIn', isLoggedIn)

app.get('/api/users/logout', logout)

app.post('/api/users/:docId', protect, acceptRequest)

const port = process.env.PORT
app.listen(port, () => {
    console.log(`server started at port: ${port}`)
})