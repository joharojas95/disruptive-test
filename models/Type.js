const mongoose = require('mongoose');
const { Schema } = mongoose;

const TypeSchema = new Schema({
    name: {// validaciones front
        type: String,
        required: true,
        unique: true
    },
    front: {// validaciones front
        type: String,
        required: true,
        unique: true
    },
    back: {// validaciones back
        type: Array,
        required: true,
    },
});

module.exports = mongoose.model('Type', TypeSchema);