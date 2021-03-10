const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')

dotenv.config({ path: "./config.env" })

const { getAllDocs, createNewDocument, getSingleDoc, updateDoc, deleteDoc, doesDocExist } = require('./controllers/docController')

const { signup, login, protect, isOwner, isLoggedIn, logout } = require('./controllers/authController')


mongoose.connect('mongodb://localhost/test-db', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(() => console.log('DB connection successful!'))

app.use(cookieParser())

app.use(express.json())

app.get('/api/docs', protect, getAllDocs)

app.get('/api/docs/:id', protect, isOwner, getSingleDoc)

app.post('/api/docs', protect, doesDocExist, createNewDocument)

app.patch('/api/docs/:id', protect, isOwner, updateDoc)

app.delete('/api/docs/:id', protect, isOwner, deleteDoc)

app.post('/api/users/signup', signup)

app.post('/api/users/login', login)

app.get('/api/users/isLoggedIn', isLoggedIn)

app.get('/api/users/logout', logout)

const port = process.env.PORT
app.listen(port, () => {
    console.log(`server started at port: ${port}`)
})