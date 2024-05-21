const Techniques = require('../models/techniques.model.js');

exports.create = async (req, res) => {
    const technique = new Techniques({
        name: req.body.name,
    })

    try {
        await technique.save()
        res.status(201).json({
            success: true,
            msg: "Nova técnica criada com sucesso!",
            URL: `/techniques/${technique._id}`
        });
    } catch (err) {
        if (err.name === "ValidationError") {
            let errors = [];
            Object.keys(err.errors).forEach(key => {
                errors.push(err.errors[key].message);
            });
            return res.status(400).json({
                success: false,
                msg: err.message || "Ocorreu algum erro ao criar a nova técnica."
            })
        }
    }
}

exports.getAll = async (req, res) => {
    try {
        let data = await Techniques
            .find()
            .select('name image type')
            .exec();
        res.status(200).json({
            success: true,
            technique: data
        });
    } catch (err) {
        if (err.name === "ValidationError") {
            let errors = [];
            Object.keys(err.errors).forEach(key => {
                errors.push(err.errors[key].message);
            });
            return res.status(400).json({
                success: false,
                msg: err.message || "Ocorreu algum erro ao recuperar as técnicas."
            })
        }
    }
}

exports.findTechnique = async (req, res) => {
    try {
        const technique = await Techniques.findById(req.params.techniqueID).exec();

        if (technique === null) {
            res.status(404).json({
                success: false,
                msg: `Não foi possível encontrar nenhuma técnica com o ID ${req.params.techniqueID}`
            })
        }

        res.json({
            success: true,
            technique: technique
        })
    } catch (err) {
        if (err.name === "ValidationError") {
            let errors = [];
            Object.keys(err.errors).forEach(key => {
                errors.push(err.errors[key].message);
            });
            return res.status(400).json({
                success: false,
                msg: `Erro ao recuperar a técnica com ID ${req.params.techniqueID}.`
            })
        }
    }
}

exports.update = async (req, res) => {
    try {
        const technique = await Techniques.findByIdAndUpdate(req.params.techniqueID, req.body).exec();

        if (!technique) {
            return res.status(404).json({
                message: `Não é possível atualizar a técnica com id=${req.params.techniqueID}. Por favor, verifica se esta já existe.`
            });
        }
        res.status(200).json({
            message: `Técnica atualizada com sucesso!`
        });
    } catch (err) {
        res.status(500).json({
            message: `Erro ao atualizar técnica.`
        });
    }
}

exports.delete = async (req, res) => {
    try {
        const technique = await Techniques.findByIdAndRemove(req.params.techniqueID).exec()

        if (!technique) {
            res.status(404).json({
                message: `Não é possivel excluir a técnica com id=${req.params.techniqueID} pois ela não existe.`
            });
        } else {
            res.status(200).json({
                message: `Técnica com id=${req.params.techniqueID} foi excluída com sucesso!`
            })
        }
    } catch (err) {
        res.status(500).json({
            message: `Erro ao excluir a técnica com o id=${req.params.techniqueID}`
        });
    };
}