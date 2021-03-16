const mongoose = require('mongoose')

const docSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'UserModel'
    },
    collaborators: {
        type: [{
            type: mongoose.Schema.ObjectId,
            ref: 'UserModel'
        }],
        default: []
    },
    content: {
        type: Array,
        default: [
            {
                type: 'paragraph',
                children: [
                    { text: 'This is a simple rich text editor! Much better than a ' },
                    { text: '<textarea>', code: true },
                    { text: '!' }
                ]
            }
        ],
        required: true
    }
})

const DocModel = mongoose.model('DocModel', docSchema)
module.exports = DocModel