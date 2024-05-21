const Arts = require('../models/arts.model.js');

exports.create = async (req, res) => {
    const art = new Arts({
        name: req.body.name,
        image: req.body.image,
        artist: req.body.artist,
        info: req.body.info,
        date: req.body.date,
        technique: req.body.technique,
        location: req.body.location,
    })

    try {
        await art.save()
        res.status(201).json({
            success: true,
            msg: "Nova obra de arte criada com sucesso!",
            URL: `/arts/${art._id}`
        });
    } catch (err) {
        if (err.name === "ValidationError") {
            let errors = [];
            Object.keys(err.errors).forEach(key => {
                errors.push(err.errors[key].message);
            });
            return res.status(400).json({
                success: false,
                msg: err.message || "Ocorreu algum erro ao criar a nova obra de arte."
            })
        }
    }
}

exports.getAll = async (req, res) => {
    const technique = req.query.technique;
    const artist = req.query.artist;
    const condition = technique ? {technique: technique} : artist ? {artist: artist} : {};
    try {
        let data = await Arts
            .find(condition)
            .exec();
        res.status(200).json({
            success: true,
            arts: data
        });
    } catch (err) {
        if (err.name === "ValidationError") {
            let errors = [];
            Object.keys(err.errors).forEach(key => {
                errors.push(err.errors[key].message);
            });
            return res.status(400).json({
                success: false,
                msg: err.message || "Ocorreu algum erro ao recuperar as obras de arte."
            })
        }
    }
}

exports.findArt = async (req, res) => {
    try {
        const art = await Arts.findById(req.params.id).exec();

        if (art === null) {
            res.status(404).json({
                success: false,
                msg: `Não foi possível encontrar nenhuma obra de arte com o ID ${req.params.id}`
            })
        }

        res.json({
            success: true,
            art: art
        })
    } catch (err) {
        if (err.name === "ValidationError") {
            let errors = [];
            Object.keys(err.errors).forEach(key => {
                errors.push(err.errors[key].message);
            });
            return res.status(400).json({
                success: false,
                msg: `Erro ao recuperar a obra de arte com ID ${req.params.id}.`
            })
        }
    }
}

exports.update = async (req, res) => {
    try {
        const art = await Arts.findByIdAndUpdate(req.params.id, req.body).exec();

        if (!art) {
            return res.status(404).json({
                message: `Não é possível atualizar a obra de arte com id=${req.params.id}. Verifica se ela existe!`
            });
        }
        res.status(200).json({
            message: `Obra de arte atualizada com sucesso!`
        });
    } catch (err) {
        res.status(500).json({
            message: `Erro ao atualizar obra de arte.`
        });
    }
}

exports.delete = async (req, res) => {
    try {
        const art = await Arts.findByIdAndRemove(req.params.id).exec()

        if (!art) {
            res.status(404).json({
                message: `Não é possivel excluir a obra de arte com id=${req.params.id}.`
            });
        } else {
            res.status(200).json({
                message: `Obra de arte com id=${req.params.id} foi excluída com sucesso`
            })
        }
    } catch (err) {
        res.status(500).json({
            message: `Erro ao excluir a obra de arte com o id=${req.params.id}`
        });
    };
}