const mongoose = require('mongoose');
const { Schema } = mongoose;

const ContentSchema = new Schema({
    name: {// Nombre del contenido
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: undefined
    },
    theme: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Theme',
        default: undefined
    },
    img: {
        type: String,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: undefined
    },
    content: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    creation_date: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Content', ContentSchema);