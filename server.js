const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config({ path: "./config.env" })

const { getAllDocs, createNewDocument, getSingleDoc, updateDoc, deleteDoc } = require('./controllers/docController')

const { signup, login, protect } = require('./controllers/authController')


mongoose.connect('mongodb://localhost/pagination', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(() => console.log('DB connection successful!'))

app.use(express.json())

app.get('/api/docs', protect, getAllDocs)

app.get('/api/docs/:id', protect, getSingleDoc)

app.post('/api/docs', protect, createNewDocument)

app.patch('/api/docs/:id', protect, updateDoc)

app.delete('/api/docs/:id', protect, deleteDoc)

app.post('/api/users/signup', signup)

app.post('/api/users/login', login)


const port = process.env.PORT
app.listen(port, () => {
    console.log(`server started at port: ${port}`)
})