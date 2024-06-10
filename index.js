const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const config = require('./config');
const Type = require('./models/Type');
const User = require('./models/User');
const path = require('path');

const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecret,
};

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());


// MongoDB connection
mongoose.connect('mongodb://localhost:27017/disruptive_db', { useNewUrlParser: true, useUnifiedTopology: true });

// Define routes and middleware
app.get('/api', (req, res) => {
    res.send('Hello from the API!');
});

require('./controllers/auth.js')(app);
require('./controllers/categories.js')(app);
require('./controllers/types.js')(app);
require('./controllers/themes.js')(app);
require('./controllers/content.js')(app);

passport.use(new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
        const user = await User.findOne({ _id: jwtPayload.id });
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (error) {
        return done(error, false);
    }
}));

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    const seedTypes = async () => {

        let allTypes = await Type.find().lean();

        const seed = [
            {
                name: "Imágenes",
                front: "image/*",
                back: ['image/gif', 'image/jpeg', 'image/png']
            },
            {
                name: "URLs de YouTube",
                front: "/^(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?$/",
                back: ["/^(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?$/"]
            },
            {
                name: "Documentos de Texto (txt)",
                front: "text/plain",
                back: ['.txt']
            },
        ]

        if (allTypes.length !== seed.length) {
            console.log("Agregando tipos de contenido en BD ...")
            await Type.deleteMany({});
            await Type.insertMany(seed);
        }
    }
    const seedAdmin = async () => {

        let existAdmin = await User.findOne({ role: "admin", email: "admin@admin.com" }).lean();

        let adminUser = new User({
            username: "admin",
            email: "admin@admin.com",
            role: "admin",
            password: "$2a$10$wQXAQea5z8DO5Y6NZxohmOdId1nAGeIwhY13xjzcNeBd5O.PAJkLC"
        });

        if (!existAdmin) {
            console.log("Agregando usuario admin en BD...")
            await adminUser.save();
        }

        let existCreator = await User.findOne({ role: "creator", email: "creator@creator.com" }).lean();

        let creatorUser = new User({
            username: "creator",
            email: "creator@creator.com",
            role: "creator",
            password: "$2a$10$wQXAQea5z8DO5Y6NZxohmOdId1nAGeIwhY13xjzcNeBd5O.PAJkLC"
        });

        if (!existCreator) {
            console.log("Agregando usuario creator en BD...")
            await creatorUser.save();
        }

        let existReader = await User.findOne({ role: "reader", email: "reader@reader.com" }).lean();

        let readerUser = new User({
            username: "reader",
            email: "reader@reader.com",
            role: "reader",
            password: "$2a$10$wQXAQea5z8DO5Y6NZxohmOdId1nAGeIwhY13xjzcNeBd5O.PAJkLC"
        });

        if (!existReader) {
            console.log("Agregando usuario reader en BD...")
            await readerUser.save();
        }
    }
    seedTypes()
    seedAdmin()
});