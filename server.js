const express = require('express')
const app = express()
const mongoose = require('mongoose')

const { getAllDocs, createNewDocument, getSingleDoc, updateDoc, deleteDoc } = require('./controllers/docController')

const { signup } = require('./controllers/authController')

mongoose.connect('mongodb://localhost/pagination', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(() => console.log('DB connection successful!'))

app.use(express.json())

app.get('/api/docs', getAllDocs)

app.get('/api/docs/:id', getSingleDoc)

app.post('/api/docs', createNewDocument)

app.patch('/api/docs/:id', updateDoc)

app.delete('/api/docs/:id', deleteDoc)

app.post('/api/users/signup', signup)


app.listen(8000, () => {
    console.log("server started at port: 8000")
})