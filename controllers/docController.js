const DocModel = require('../models/docModel')

exports.getAllDocs = async function (req, res) {
    try {
        const allDocs = await DocModel.find({})

        const ownerDocs = await DocModel.find({
            owner: req.user._id,
        })

        let collabDocs = allDocs.filter(doc => {
            if(doc.collaborators.includes(req.user._id))  {
                return true
            }
            return false
        })

        const docs = ownerDocs.concat(collabDocs)

        //console.log(collabDocs.length)

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
                message: "document of the same name already exists!"
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

exports.getSingleDocPopulated = async function (req, res) {
    try {
        const doc = await DocModel.findById(req.params.id).populate({
            path: "collaborators",
            select: "username"
        })

        res.status(200).json({
            status: 'success',
            data: {
                doc
            }
        })
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err.message
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