const DocModel = require('../models/docModel')

exports.getAllDocs = async function (req, res) {
    try {
        const docs = await DocModel.find({
            owner: req.user._id
        })

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

exports.doesDocExist = async function (req, res, next) {
    try {
        const nameCheck = await DocModel.findOne(
            {
                name: req.body.name,
                owner: req.user._id
            }
        )

        if (nameCheck) {
            res.status(400).json({
                status: "fail",
                message: "document of same name already exists!"
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

exports.createNewDocument = async function (req, res) {
    try {

        // const nameCheck = await DocModel.findOne(
        //     {
        //         name: req.body.name,
        //         owner: req.user._id
        //     }
        // )

        // if (nameCheck) {
        //     res.status(400).json({
        //         status: "fail",
        //         message: "document of same name already exists!"
        //     })
        //     return
        // }

        const newDoc = await DocModel.create(
            {
                name: req.body.name,
                owner: req.user._id
            }
        )

        res.status(200).json({
            status: 'success',
            data: {
                doc: newDoc
            }
        })

    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        })
    }
}

exports.getSingleDoc = async function (req, res) {
    try {
        const doc = await DocModel.findById(req.params.id)

        res.status(200).json({
            status: 'success',
            data: {
                doc
            }
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}

exports.updateDoc = async function (req, res) {
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

exports.deleteDoc = async function (req, res) {
    try {
        await DocModel.findByIdAndDelete(req.params.id)

        res.status(200).json({
            status: 'success',
            message: 'document deleted'
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        })
    }
}