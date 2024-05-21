const Artists = require('../models/artists.model.js');

exports.create = async(req, res) => {

    const artist = new Artists({
        name: req.body.name,
        image: req.body.image,
        info: req.body.info,
    })

    try {
        await artist.save()
        res.status(201).json({success: true, msg: "Novo artista criado com sucesso!", URL: `/artists/${artist._id}`});
    } catch (err){
        if (err.name === "ValidationError") {
            let errors = [];
            Object.keys(err.errors).forEach(key => {
                errors.push(err.errors[key].message);
            });
            return res.status(400).json({ success: false, msg: err.message || "Ocorreu algum erro ao criar o novo artista."})
        }

    }
}

exports.getAll = async (req, res) => {
    try {
        let data = await Artists
            .find()
            .select('name image born death')
            .exec();
        res.status(200).json({ success: true, artist: data });
    } catch (err) {
        if (err.name === "ValidationError") {
            let errors = [];
            Object.keys(err.errors).forEach(key => {
                errors.push(err.errors[key].message);
            });
            return res.status(400).json({ success: false, msg: err.message || "Ocorreu algum erro ao recuperar os artistas."})
        }
    }
}

exports.findById = async (req, res) => {
    try {
        const artist = await Artists.findById(req.params.id).exec();

        if (artist === null) {
            res.status(404).json({success: false, msg: `Não foi possível encontrar nenhum artista com o ID ${req.params.id}`})
        }

        res.json({success: true, artist: artist})
    } catch (err) {
        if (err.name === "ValidationError") {
            let errors = [];
            Object.keys(err.errors).forEach(key => {
                errors.push(err.errors[key].message);
            });
            return res.status(400).json({success: false, msg: `Erro ao recuperar o artista com ID ${req.params.id}.`})
        }
    }
}

exports.update = async (req, res) => {
    try {
        const artist = await Artists.findByIdAndUpdate(req.params.id, req.body).exec();

        if (!artist) {
            return res.status(404).json({message: `Não é possível atualizar o artista com id=${req.params.id}. Verifica se o artista existe!`});
        }
        res.status(200).json({message: `Artista atualizado com sucesso!`});
    } catch (err) {
        res.status(500).json({message: `Erro ao atualizar artista`});
    }   
}

exports.delete = async (req, res) => {
    try {
        const artist = await Artists.findByIdAndRemove(req.params.id).exec()
        
        if (!artist) {
            res.status(404).json({message: `Não é possivel excluir o artista com id=${req.params.id}.`});
        } else {
            res.status(200).json({message: `Artista com id=${req.params.id} foi excluído com sucesso`})
        }
    } catch (err) {
        res.status(500).json({message: `Erro ao excluir o artista com o id=${req.params.id}`});
    };
}