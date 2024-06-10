const mongoose = require('mongoose');
const { Schema } = mongoose;

const ThemeSchema = new Schema({
    name: {// Nombre del tema
        type: String,
        required: true,
        unique: true
    },
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }],
    color: {// Nombre del tema
        type: String,
        required: true
    },
});

module.exports = mongoose.model('Theme', ThemeSchema);