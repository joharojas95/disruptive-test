module.exports = function (app) {

    const bcrypt = require('bcryptjs');
    const jwt = require('jsonwebtoken');
    const config = require('../config');
    const User = require('../models/User');

    // Register Route
    app.post('/register', async (req, res) => {
        const { username, email, password, role } = req.body;

        try {
            let userVerif = await User.findOne({ email });
            if (userVerif) {
                return res.status(400).json({ msg: 'El correo ya existe' });
            }

            let usernameVerif = await User.findOne({ username });
            if (usernameVerif) {
                return res.status(400).json({ msg: 'El nombre de usuario ya existe' });
            }

            let finalUser = new User({ username, email, password, role });

            const salt = await bcrypt.genSalt(10);
            finalUser.password = await bcrypt.hash(password, salt);

            await finalUser.save();

            res.status(201).json({ message: 'User registered successfully' });


        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    });

    app.post('/login', async (req, res) => {
        const { email, password } = req.body;

        try {
            // Check if the user exists
            let user = await User.findOne({ email });
            if (!user  || !user.comparePassword(password)) {
                return res.status(400).json({ msg: 'Credenciales inválidas' });
            }

            const payload = { id: user._id, role: user.role, username: user.username };

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

    app.get('/verifyEmail', async (req, res) => {
        let findUser = await User.findOne({ email: req.query.email });

        if (findUser) {
            res.status(200).send(true);
        } else {
            res.status(200).send(false);
        }
    });

    app.get('/verifyUsername', async (req, res) => {
        let findUser = await User.findOne({ username: req.query.username });

        if (findUser) {
            res.status(200).send(true);
        } else {
            res.status(200).send(false);
        }
    });

};