module.exports = function (app) {

    const Type = require('../models/Type');
    const Category = require('../models/Category');
    const Content = require('../models/Content');
    const multer = require('multer');
    const path = require('path');
    const User = require('../models/User');
    const passport = require('passport');
    const { checkUserRole } = require('./roleMiddleware');

    // Configurar multer para guardar las imágenes en una carpeta específica
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './public/uploads/') // Directorio donde se guardarán las imágenes
        },
        filename: function (req, file, cb) {
            // Generar un nombre único para la imagen
            cb(null, Date.now() + '-' + file.originalname)
        }
    })

    // Configurar multer con las opciones de almacenamiento y filtro para subir múltiples archivos con diferentes nombres
    const upload = multer({
        storage: storage,
        // Limitar el número de archivos a 2
        limits: { files: 2 }
    });

    // Endpoint retorna todo los contenidos
    app.get('/content/all', async (req, res) => {
        let contents = await Content.find().populate('theme').populate({
            path: 'category',
            populate: {
                path: 'type',
            }
        }).populate('user').lean();
        res.status(200).send(contents)
    });

    // Endpoint retorna los contenidos por rol usuario y usuario
    app.get('/content/all/user/:user', async (req, res) => {

        let user = User.findOne({ _id: req.params.user })

        if (user.role === "admin") {
            let contents = await Content.find().populate('theme').populate({
                path: 'category',
                populate: {
                    path: 'type',
                }
            }).populate('user').lean();
            res.status(200).send(contents)
        } else {
            let contents = await Content.find({ user: req.params.user }).populate('theme').populate({
                path: 'category',
                populate: {
                    path: 'type',
                }
            }).populate('user').lean();
            res.status(200).send(contents)
        }

    });

    // Endpoint para agregar contenido
    app.post('/content/add', passport.authenticate('jwt', { session: false }), checkUserRole(['admin','creator']), upload.fields([
        { name: 'img1', maxCount: 1 },
        { name: 'img2', maxCount: 1 }
    ]), async (req, res) => {
        try {
            const { name, description, user, theme, type, url } = req.body;

            let findType = await Category.findOne({ _id: type }).populate('type')

            // Validar si el tipo es una URL
            if (findType.type.name === 'URLs de YouTube') {

                // Guardar el contenido con URL
                const newContent = new Content({
                    name,
                    description,
                    user,
                    theme,
                    img: "/uploads/" + req.files['img1'][0].filename,
                    category: type,
                    content: url
                });

                const savedContent = await newContent.save();
                res.json(savedContent);
            } else {
                const newContent = new Content({
                    name,
                    description,
                    user,
                    theme,
                    img: "/uploads/" + req.files['img1'][0].filename,
                    category: type,
                    content: "/uploads/" + req.files['img2'][0].filename
                });

                const savedContent = await newContent.save();
                res.json(savedContent);
            }
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });

    // Endpoint para borrar un contenido
    app.delete('/content/delete/:id', passport.authenticate('jwt', { session: false }), checkUserRole(['admin']), async (req, res) => {
        try {
            const item = await Content.findByIdAndDelete(req.params.id);
            if (!item) {
                return res.status(404).send({ message: 'Contenido no encontrado' });
            }
            res.status(200).send({ message: 'Contenido borrado con éxito' });
        } catch (error) {
            res.status(500).send({ message: 'Error al borrar el contenido', error });
        }
    });

    // Endpoint para obtener un contenido
    app.get('/content/get/:id', passport.authenticate('jwt', { session: false }), checkUserRole(['admin','creator']), async (req, res) => {
        try {
            const item = await Content.findById(req.params.id);
            if (!item) {
                return res.status(404).send({ message: 'Contenido no encontrado' });
            }
            res.status(200).send(item);
        } catch (error) {
            res.status(500).send({ message: 'Error al buscar el contenido', error });
        }
    });

    // Endpoint para editar un contenido
    app.put('/content/update', passport.authenticate('jwt', { session: false }), checkUserRole(['admin','creator']), upload.fields([
        { name: 'img1', maxCount: 1 },
        { name: 'img2', maxCount: 1 }
    ]), async (req, res) => {
        try {
            const { id, name, description, user, theme, type, url } = req.body;

            let findType = await Category.findOne({ _id: type }).populate('type')

            // Verificar si existe el nombre de contenido
            const contentVerif = await Content.findOne({ name: name, _id: { $ne: id } });

            if (contentVerif) {
                return res.status(400).json({ msg: 'El nombre de contenido ya existe' });
            }

            // Verificar si existe el contenido
            const finalContent = await Content.findOne({ _id: id });

            if (!finalContent) {
                return res.status(400).json({ msg: 'El contenido no existe' });
            }

            // Validar si el tipo es una URL
            if (findType.type.name === 'URLs de YouTube') {

                finalContent.name = name
                finalContent.description = description
                finalContent.user = user
                finalContent.theme = theme
                finalContent.category = type
                finalContent.content = url

                if (req.files['img1']) {
                    finalContent.img = "/uploads/" + req.files['img1'][0].filename
                }

                await finalContent.save();

                res.status(201).json({ message: 'Contenido editado correctamente.' });
            } else {

                finalContent.name = name
                finalContent.description = description
                finalContent.user = user
                finalContent.theme = theme
                finalContent.category = type

                if (req.files['img1']) {
                    finalContent.img = "/uploads/" + req.files['img1'][0].filename
                }

                if (req.files['img2']) {
                    finalContent.content = "/uploads/" + req.files['img2'][0].filename
                }

                await finalContent.save();

                res.status(201).json({ message: 'Contenido editado correctamente.' });

            }
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });

    // Endpoint para descargar archivo de contenido
    app.get('/content/download/:id', async (req, res) => {
        try {
            const item = await Content.findById(req.params.id);
            if (!item) {
                return res.status(404).send({ message: 'Contenido no encontrado' });
            }

            const filePath = path.join(__dirname, '../public' + item.content);
            res.download(filePath);
        } catch (error) {
            res.status(500).send({ message: 'Error al buscar el contenido', error });
        }


    });
};