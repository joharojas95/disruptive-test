const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
    username: {// Nombre de usuario
        type: String,
        required: true,
        unique: true
    },
    email: {// Email
        type: String,
        required: true,
        unique: true
    },
    role: { // Rol: Admin, Creador, Lector
        type: String,
        required: true,
        enum: ['admin', 'creator', 'reader'],
    },
    password: {// Contraseña
        type: String,
        required: true
    },
    creation_date: { type: Date },// Fecha de creación
});

// Método para comparar contraseñas
UserSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);