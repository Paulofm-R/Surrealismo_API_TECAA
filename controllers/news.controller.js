const News = require('../models/news.model.js');

exports.create = async(req, res) => {

    const news = new News({
        name: req.body.name,
        image: req.body.image,
        day: req.body.day,
        price: req.body.price,
        info: req.body.info,
        locality: req.body.locality,
        type: req.body.type,
    })

    try {
        await news.save()
        res.status(201).json({success: true, msg: "Novo evento criado com sucesso!", URL: `/news/${news._id}`});
    } catch (err){
        if (err.name === "ValidationError") {
            let errors = [];
            Object.keys(err.errors).forEach(key => {
                errors.push(err.errors[key].message);
            });
            return res.status(400).json({ success: false, msg: err.message || "Ocorreu algum erro ao criar o novo evento."})
        }

    }
}

exports.getAll = async (req, res) => {
    try {
        let data = await News
            .find()
            .select('name image type info')
            .exec();
        res.status(200).json({ success: true, news: data });
    } catch (err) {
        if (err.name === "ValidationError") {
            let errors = [];
            Object.keys(err.errors).forEach(key => {
                errors.push(err.errors[key].message);
            });
            return res.status(400).json({ success: false, msg: err.message || "Ocorreu algum erro ao recuperar os eventos."})
        }
    }
}

exports.findById = async (req, res) => {
    try {
        const news = await News.findById(req.params.id).exec();

        if (news === null) {
            res.status(404).json({success: false, msg: `Não foi possível encontrar nenhum evento com o ID ${req.params.id}`})
        }

        res.json({success: true, news: news})
    } catch (err) {
        if (err.name === "ValidationError") {
            let errors = [];
            Object.keys(err.errors).forEach(key => {
                errors.push(err.errors[key].message);
            });
            return res.status(400).json({success: false, msg: `Erro ao recuperar o evento com ID ${req.params.id}.`})
        }
    }
}

exports.findByType = async (req, res) => {
    try {
        const news = await News.find({type:req.params.type}).select('name image type info').exec();

        if (news === null) {
            res.status(404).json({success: false, msg: `Não foi possível encontrar nenhum artigo do tipo ${req.params.type}`})
        }

        res.json({success: true, news: news})
    } catch (err) {
        if (err.name === "ValidationError") {
            let errors = [];
            Object.keys(err.errors).forEach(key => {
                errors.push(err.errors[key].message);
            });
            return res.status(400).json({success: false, msg: `Erro ao recuperar artigos do tipo ${req.params.type}.`})
        }
    }
}

exports.update = async (req, res) => {
    try {
        const news = await News.findByIdAndUpdate(req.params.id, req.body).exec();

        if (!news) {
            return res.status(404).json({message: `Não é possível atualizar o evento com id=${req.params.id}. Verifica se o evento existe!`});
        }
        res.status(200).json({message: `Evento atualizado com sucesso!`});
    } catch (err) {
        res.status(500).json({message: `Erro ao atualizar evento`});
    }   
}

exports.delete = async (req, res) => {
    try {
        const news = await News.findByIdAndRemove(req.params.id).exec()
        
        if (!news) {
            res.status(404).json({message: `Não é possivel excluir o evento com id=${req.params.id}.`});
        } else {
            res.status(200).json({message: `Evento com id=${req.params.id} foi excluído com sucesso`})
        }
    } catch (err) {
        res.status(500).json({message: `Erro ao excluir o evento com o id=${req.params.id}`});
    };
}