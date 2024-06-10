module.exports = function (app) {

    const Theme = require('../models/Theme');

    app.get('/theme/all', async (req, res) => {
        let themes = await Theme.find().populate({
            path: 'categories',
            populate: {
                path: 'type',
            }
        }).lean();
        res.status(200).send(themes)
    });

    // Endpoint para agregar un nuevo tema
    app.post('/theme/add', async (req, res) => {
        try {
            // Extraer los datos de la solicitud
            const { name, categories } = req.body;

            let verifTheme = await Theme.findOne({ name: name })

            if (verifTheme) {
                return res.status(400).json({ msg: 'El tema ya existe' });
            }

            const colorHexMap = [
                '#ADD8E6', // Light Blue
                '#98FB98', // Pale Green
                '#FFD700', // Gold
                '#FFB6C1', // Light Pink
                '#FFA07A', // Light Salmon
                '#20B2AA', // Light Sea Green
                '#9370DB', // Medium Purple
                '#F08080', // Light Coral
                '#00CED1', // Dark Turquoise
                '#FA8072', // Salmon
                '#BA55D3', // Medium Orchid
                '#87CEEB', // Sky Blue
            ];

            // Elegir un color aleatorio del array
            const randomColor = colorHexMap[Math.floor(Math.random() * colorHexMap.length)];

            // Crear un nuevo tema
            const newTheme = new Theme({
                name,
                categories,
                color: randomColor
            });

            // Guardar el nuevo tema en la base de datos
            await newTheme.save();

            res.status(201).json({ message: 'Tema creado correctamente.', theme: newTheme });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al crear el tema.' });
        }
    });

    // Endpoint para borrar un tema
    app.delete('/theme/delete/:id', async (req, res) => {
        try {
            const item = await Theme.findByIdAndDelete(req.params.id);
            if (!item) {
                return res.status(404).send({ message: 'Tema no encontrado' });
            }
            res.status(200).send({ message: 'Tema borrado con éxito' });
        } catch (error) {
            res.status(500).send({ message: 'Error al borrar el tema', error });
        }
    });

    // Endpoint para obtener un tema
    app.get('/theme/get/:id', async (req, res) => {
        try {
            const item = await Theme.findById(req.params.id);
            if (!item) {
                return res.status(404).send({ message: 'Tema no encontrado' });
            }
            res.status(200).send(item);
        } catch (error) {
            res.status(500).send({ message: 'Error al buscar el tema', error });
        }
    });

    // Endpoint para editar un tema
    app.put('/theme/update', async (req, res) => {
        try {
            const { id, name, categories } = req.body;

            let verifTheme = await Theme.findOne({ name: name, _id: { $ne: id } })

            if (verifTheme) {
                return res.status(400).json({ msg: 'El tema ya existe' });
            }

            const finalTheme = await Theme.findOne({ _id: id });

            if (!finalTheme) {
                return res.status(400).json({ msg: 'El tema no existe' });
            }

            finalTheme.name = name
            finalTheme.categories = categories

            await finalTheme.save();

            res.status(201).json({ message: 'Tema editado correctamente.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al crear la categoría.' });
        }
    });

};