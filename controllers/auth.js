module.exports = function (app) {

    const bcrypt = require('bcryptjs');
    const jwt = require('jsonwebtoken');
    const config = require('../config');
    const User = require('../models/User');

    // Endpoint registro de usuarios
    app.post('/register', async (req, res) => {
        const { username, email, password, role } = req.body;

        try {

            // Se valida si existe el correo
            let userVerif = await User.findOne({ email });
            if (userVerif) {
                return res.status(400).json({ msg: 'El correo ya existe' });
            }

            // Se valida si existe el usuario
            let usernameVerif = await User.findOne({ username });
            if (usernameVerif) {
                return res.status(400).json({ msg: 'El nombre de usuario ya existe' });
            }

            let finalUser = new User({ username, email, password, role });

            // Hash password
            const salt = await bcrypt.genSalt(10);
            finalUser.password = await bcrypt.hash(password, salt);

            // Se guarda en BD
            await finalUser.save();

            res.status(201).json({ message: 'Usuario registrado exitosamente' });
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    });

    // Endpoint login de usuarios
    app.post('/login', async (req, res) => {
        const { email, password } = req.body;

        try {

            // Se valida si existe el usuario y si las credencials
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ msg: 'No existe el usuario' });
            }

            // Se validan las credencials
            if (!user.comparePassword(password)) {
                return res.status(400).json({ msg: 'Credenciales inválidas' });
            }

            const payload = { id: user._id, role: user.role, username: user.username };

            // token de auth
            jwt.sign(payload, config.jwtSecret, { expiresIn: '1h' },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    });

    // Endpoint para verificar si un correo o username existe
    app.get('/verifyEmail', async (req, res) => {
        try {
            let findUser;
            if (req.query.email) {
                findUser = await User.findOne({ email: req.query.email });
            }

            if (req.query.username) {
                findUser = await User.findOne({ username: req.query.username });
            }

            if (findUser) {
                res.status(200).send(true);
            } else {
                res.status(200).send(false);
            }
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    });

};