const mongoose = require('mongoose');
const { Schema } = mongoose;

const CategorySchema = new Schema({
    name: {// Nombre de la categoria de contenido
        type: String,
        required: true,
        unique: true
    },
    type: {// Tipo
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Type',
        default: undefined
    },
});

module.exports = mongoose.model('Category', CategorySchema);