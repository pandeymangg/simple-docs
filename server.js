const express = require('express')
const app = express()
const mongoose = require('mongoose')
const DocModel = require('./docModel')

mongoose.connect('mongodb://localhost/pagination', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => console.log('DB connection successful!'))

app.use(express.json())

app.get('/api/docs', getAllDocs)

async function getAllDocs(req, res) {
    try {
        const docs = await DocModel.find({})

        res.status(200).json({
            status: 'success',
            results: docs.length,
            data: {
                docs
            }
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        })
    }
}

app.get('/api/docs/:id', getSingleDoc)

async function getSingleDoc(req, res) {
    try {
        const doc = await DocModel.findById(req.params.id)

        res.status(200).json({
            status: 'success',
            data: {
                doc: doc
            }
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}

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

    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}

app.patch('/api/docs/:id', updateDoc)

async function updateDoc(req, res) {
    try {
        const updatedDoc = await DocModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        })

        res.status(201).json({
            status: 'success',
            data: {
                doc: updatedDoc
            }
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        })
    }
}

app.listen(8000, () => {
    console.log("server started at port: 8000")
})