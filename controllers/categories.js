module.exports = function (app) {

    const passport = require('passport');
    const Type = require('../models/Type');
    const Category = require('../models/Category');
    const { checkUserRole } = require('./roleMiddleware');

    app.get('/category/all', async (req, res) => {
        let categories = await Category.find().populate('type').lean();
        res.status(200).send(categories)
    });

    // Ruta para agregar una nueva categoría
    app.post('/category/add', passport.authenticate('jwt', { session: false }), checkUserRole(['admin']), async (req, res) => {
        try {
            const { name, typeId } = req.body;

            // Verificar si el tipo existe
            const type = await Type.findById(typeId);
            if (!type) {
                return res.status(404).json({ message: 'El tipo especificado no existe.' });
            }

            // Verificar si existe el nombre de categoría
            const categoryVerif = await Category.findOne({ name: name });

            if (categoryVerif) {
                return res.status(400).json({ msg: 'El nombre de categoría ya existe' });
            }

            const categoryVerifType = await Category.findOne({ type: typeId });

            if (categoryVerifType) {
                return res.status(400).json({ msg: 'Ya existe una categoría con este tipo de contenido' });
            }

            // Crear una nueva categoría
            const newCategory = new Category({
                name,
                type: typeId
            });

            // Guardar la nueva categoría en la base de datos
            await newCategory.save();

            res.status(201).json({ message: 'Categoría creada correctamente.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al crear la categoría.' });
        }
    });

    // Ruta para borrar un ítem
    app.delete('/category/delete/:id', passport.authenticate('jwt', { session: false }), checkUserRole(['admin']), async (req, res) => {
        try {
            const item = await Category.findByIdAndDelete(req.params.id);
            if (!item) {
                return res.status(404).send({ message: 'Categoría no encontrada' });
            }
            res.status(200).send({ message: 'Categoría borrada con éxito' });
        } catch (error) {
            res.status(500).send({ message: 'Error al borrar la categoría', error });
        }
    });

    // Ruta para borrar un ítem
    app.get('/category/get/:id', passport.authenticate('jwt', { session: false }), checkUserRole(['admin']), async (req, res) => {
        try {
            const item = await Category.findById(req.params.id);
            if (!item) {
                return res.status(404).send({ message: 'Categoría no encontrada' });
            }
            res.status(200).send(item);
        } catch (error) {
            res.status(500).send({ message: 'Error al buscar la categoría', error });
        }
    });

    // Ruta para editar una categoría
    app.put('/category/update', passport.authenticate('jwt', { session: false }), checkUserRole(['admin']), async (req, res) => {
        try {
            const { id, name, typeId } = req.body;

            // Verificar si el tipo existe
            const type = await Type.findById(typeId);
            if (!type) {
                return res.status(404).json({ message: 'El tipo especificado no existe.' });
            }

            // Verificar si existe el nombre de categoría
            const categoryVerif = await Category.findOne({ name: name, _id: { $ne: id } });

            if (categoryVerif) {
                return res.status(400).json({ msg: 'El nombre de categoría ya existe' });
            }

            const categoryVerifType = await Category.findOne({ type: typeId, _id: { $ne: id } });

            if (categoryVerifType) {
                return res.status(400).json({ msg: 'Ya existe una categoría con este tipo de contenido' });
            }

            const finalCategory = await Category.findOne({ _id: id });

            if (!finalCategory) {
                return res.status(400).json({ msg: 'La categoría no existe' });
            }

            finalCategory.name = name
            finalCategory.type = typeId

            // Guardar la nueva categoría en la base de datos
            await finalCategory.save();

            res.status(201).json({ message: 'Categoría editada correctamente.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al crear la categoría.' });
        }
    });

};