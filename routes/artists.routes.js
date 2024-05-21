const express = require('express');
const router = express.Router();
const artistsController = require('../controllers/artists.controller.js')
const { validationResult, body } = require('express-validator')
const utilities = require('../utilities/utilities.js');

/**
 * @route GET /artists/
 * @group Artists
 * @returns {object} 200 - Retorna todas as informações dos artistas - ex. [{"name":"Mario Cesariny", "image":"mc.png", "info": "Pintor Português do movimento surrealista", "arts":["obra1.png"]}, {...}]
 * @returns {Error} 400 - Erro inesperado
 * @returns {Error} 500 - Algo deu errado
 */

router.get('/', (req, res) => {
    artistsController.getAll(req, res)
})

/**
 * @route GET /artists/:id
 * @group Artists
 * @param {object} id.path - id do artista
 * @returns {object} 200 - Retorna a informação de um artista pesquisado pelo id - ex. {"name":"Mario Cesariny", "image":"mc.png", "info": "Pintor Português do movimento surrealista", "arts":["obra1.png"]}
 * @returns {Error} 400 - id inválido
 * @returns {Error} 404 - id não encontrado
 * @returns {Error} 500 - Algo deu errado
 */
router.get('/:id', (req,res) => {
    artistsController.findById(req, res)
})

/**
 * @route Post /artists/
 * @group Artists
 * @param {object} object.body - Formulário para adicionar novo artista - ex. {"name":"Cruzeiro Seixas", "image":"cs.png", "info": "Pintor Português do movimento surrealista", "arts":["obra1.png"]}
 * @returns {object} 201 - Novo artista criado com sucesso!
 * @returns {Error} 400 - Dados em falta
 * @returns {Error} 401 - É preciso estar autenticado
 * @returns {Error} 403 - Utilizador sem permissão
 * @returns {Error} 500 - Algo deu errado
 * @security Bearer
 */
router.post('/',
utilities.isAdmin,
[
    body('name').notEmpty().escape(),
    body('image').notEmpty().escape(),
    body('info').notEmpty().escape(),
] ,  (req,res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        artistsController.create(req,res)
    } else {
        res.status(404).json({errors: errors.array()});
    }
})

/**
 * @route Put /artists/:id
 * @group Artists
 * @param {object} object.body - Formulário para alterar artista - ex. {"info":"Pintor Português, ligado a fotografia"}
 * @param {object} id.path - id do artista
 * @returns {object} 200 - Artista alterada
 * @returns {Error} 401 - É preciso estar autenticado
 * @returns {Error} 403 - Utilizador sem permissão
 * @returns {Error} 404 - Artista não existe/encontrada
 * @returns {Error} 500 - Algo deu errado
 * @security Bearer
 */
router.put('/:id', utilities.isAdmin, (req, res) => {
    artistsController.update(req, res);
})

/**
 * @route DELETE /artists/:id
 * @group Artists
 * @param {object} id.path - Id do Artista
 * @returns {object} 204 - Artista eliminado
 * @returns {Error} 401 - É preciso estar autenticado
 * @returns {Error} 403 - Utilizador sem permissão
 * @returns {Error} 404 - Artista não existe/encontrada
 * @returns {Error} 500 - Algo deu errado
 * @security Bearer
 */
router.delete('/:id', utilities.isAdmin, (req, res) => {
    artistsController.delete(req, res);
})

module.exports = router;