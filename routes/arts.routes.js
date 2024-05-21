const express = require('express');
const router = express.Router();
const artController = require('../controllers/arts.controller.js')
const {
    validationResult,
    body
} = require('express-validator')
const utilities = require('../utilities/utilities.js');

/**
 * @route POST /arts/
 * @group Arts
 * @param {object} object.body - Formulario para adiconar a obra - ex. {"name":"nome da obra", "image":"image.jpeg", artist: "nome do artista", "info": "texto exemplo", "date": "2020-06-15", "technique":"nome da técnica",  "location": "Piso 3"} 
 * @returns {object} 201 - Nova obra de arte criada com sucesso!
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
    body('artist').notEmpty().escape(),
    body('info').notEmpty().escape(),
    body('date').notEmpty().escape(),
    body('technique').notEmpty().escape(),
    body('location').notEmpty().escape(),
], (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        artController.create(req, res);
    } else {
        res.status(404).json({
            errors: errors.array()
        });
    }
})

/**
 * @route GET /arts/
 * @group Arts
 * @returns {object} 200 - Lista das obras ex. [{"name":"Figuras de sopro", "image":"fc.png", "info": "Obra pintada por ...", "artists":"63c81be949960a5a2dd551ed"}, {...}]
 * @returns {Error} 400 - Erro inesperado
 * @returns {Error} 500 - Algo deu errado
 */
router.get('/', (req, res) => {
    artController.getAll(req, res);
})

/**
 * @route GET /arts/:id
 * @group Arts
 * @param {object} id.path - Id da obra pesquesido pelo id {"name":"Figuras de sopro", "image":"fc.png", "info": "Obra pintada por ...", "artists":"63c81be949960a5a2dd551ed", "date":"1947", technique:"Tinta da China", "location":"Piso 0"}
 * @returns {object} 200 - Informação da obra
 * @returns {Error} 404 - Obra não existe/encontrado
 * @returns {Error} 500 - Algo deu errado
 */
router.get('/:id', (req, res) => {
    artController.findArt(req, res);
})

/**
 * @route PUT /arts/:id
 * @group Arts
 * @param {object} object.body - Alterar alguma informação do jogo - ex. {"name":"nome da obra", "image":"image.jpeg", "data": "2020-06-15", "info": "texto exemplo", "localization": "Piso 3", artists: ["id do artista", ...]} 
 * @param {object} id.path - Id da obra
 * @returns {object} 200 - Obra alterada
 * @returns {Error} 401 - É preciso estar autenticado
 * @returns {Error} 403 - Utilizador sem permissão
 * @returns {Error} 404 - Obra não existe/encontrado
 * @returns {Error} 500 - Algo deu errado
 * @security Bearer
 */
router.put('/:id', utilities.isAdmin, (req, res) => {
    utilities.validateToken(req, res);
    artController.update(req, res);
})

/**
 * @route DELETE /arts/:id
 * @group Arts
 * @param {object} id.path - Id da obra
 * @returns {object} 204 - Obra eliminada
 * @returns {Error} 401 - É preciso estar autenticado
 * @returns {Error} 403 - Utilizador sem permissão
 * @returns {Error} 404 - Obra não existe/encontrado
 * @returns {Error} 500 - Algo deu errado
 * @security Bearer
 */
router.delete('/:id', utilities.isAdmin, (req, res) => {
    artController.delete(req, res);
})

module.exports = router;