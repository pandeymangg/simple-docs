const express = require('express')
const app = express()

const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/pagination', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('DB connection successful!'))

app.use(express.json())

app.get('/', (req, res) => {
    res.send("Home Page")
})

app.listen(8000, () => {
    console.log("server started at port: 8000")
})