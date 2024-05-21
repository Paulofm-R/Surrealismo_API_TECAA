const Games = require('../models/games.model.js')

exports.create = async (req, res) => {
    console.log(req.body);
    console.log(req.body.questions);

    const game = new Games({
        name: req.body.name,
        image: req.body.image,
        questions: req.body.questions,
        points: req.body.points,
    });

    try {
        await game.save();
        res.status(201).json({success: true, msg: "Novo Jogo criado com sucesso!", URL: `/games/${game._id}`});
    } catch (err) {
        if (err.name === "ValidationError") {
            let errors = [];
            Object.keys(err.errors).forEach(key => {
                errors.push(err.errors[key].message);
            });
            return res.status(400).json({ success: false, msg: err.message || "Ocorreu algum erro ao criar o novo jogo."})
        }
    }
}

exports.getAll = async (req, res) => {
    try {
        let data = await Games
            .find()
            .select("name image type")
            .exec();
        res.status(200).json({ success: true, msg: data})
    } catch (err) {
        if (err.name === "ValidationError") {
            let errors = [];
            Object.keys(err.errors).forEach(key => {
                errors.push(err.errors[key].message);
            });
            return res.status(400).json({ success: false, msg: err.message || "Ocorreu algum erro ao recuperar os jogos."})
        }
    }
}

exports.findByType = async (req, res) => {
    try {
        const games = await Games
            .find({type:req.params.type})
            .select("name image type")
            .exec();

        if (games === null) {
            res.status(404).json({success: false, msg: `Não foi possível encontrar nenhum jogo do tipo ${req.params.type}`})
        }

        res.json({success: true, games: games})
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

exports.findGame = async (req, res) => {
    try {
        const game = await Games.findById(req.params.gameID).exec();

        if (game === null) {
            res.status(404).json({success: false, msg: `Não foi possível encontrar nenhum jogo com o ID ${req.params.gameID}`})
        }
        res.json({success: true, game: game})
    } catch (err) {
        if (err.name === "ValidationError") {
            let errors = [];
            Object.keys(err.errors).forEach(key => {
                errors.push(err.errors[key].message);
            });
            return res.status(400).json({success: false, msg: `Erro ao recuperar o jogo com ID ${req.params.gameID}.`})
        }
    }
}

exports.update = async (req, res) => {
    try {
        const game = await Games.findByIdAndUpdate(req.params.gameID, req.body).exec();

        if (!game) {
            return res.status(404).json({success: false, msg: `Não é possivel atualizar o jogo com id=${req.params.gameID}. Verifica se o jogo existe.`});
        }
        res.status(200).json({success: true, msg: `Jogo com id=${req.params.gameID} foi alterado com sucesso!`})
    } catch (err) {
        if (err.name === "ValidationError") {
            let errors = [];
            Object.keys(err.errors).forEach(key => {
                errors.push(err.errors[key].message);
            });
            return res.status(400).json({success: false, msg: `Erro ao alterar o jogo com ID ${req.params.gameID}.`})
        }
    }
}

exports.delete = async (req, res) => {
    try {
        const game = await Games.findByIdAndRemove(req.params.gameID).exec()
        
        if (!game) {
            res.status(404).json({message: `Não é possivel excluir o jogo com id=${req.params.gameID}. Talvez o jogo não foi encontrado!`});
        } else {
            res.status(200).json({message: `Jogo com id=${req.params.gameID} foi excluído com sucesso`})
        }
    } catch (err) {
        if (err.name === "ValidationError") {
            let errors = [];
            Object.keys(err.errors).forEach(key => {
                errors.push(err.errors[key].message);
            });
            return res.status(400).json({success: false, msg: `Erro ao excluir o jogo com ID ${req.params.gameID}.`})
        }
    }
}