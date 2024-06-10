module.exports = function (app) {

    const Type = require('../models/Type');

    // Endpoint para retornar todos los tipos
    app.get('/types/all', async (req, res) => {
        let types = await Type.find().lean();

        let finalTypes = types.map((item) => ({
            id: item._id,
            name: item.name,
        }));

        res.status(200).send(finalTypes)
    });
};