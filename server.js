const express = require('express')
const app = express()
const mongoose = require('mongoose')
const DocModel = require('./docModel')

mongoose.connect('mongodb://localhost/pagination', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('DB connection successful!'))

app.use(express.json())

app.post('/api/docs', createNewDocument)

async function createNewDocument(req, res) {
    try {
        const newDoc = await DocModel.create(req.body)

        res.status(200).json({
            status: 'success',
            data: {
                doc: newDoc
            }
        })

    } catch(err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}

app.listen(8000, () => {
    console.log("server started at port: 8000")
})