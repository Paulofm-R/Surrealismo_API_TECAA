const express = require('express');
const router = express.Router();
const techniqueController = require('../controllers/techniques.controller.js')
const {
    validationResult,
    body
} = require('express-validator')
const utilities = require('../utilities/utilities.js');

/**
 * @route POST /techniques/
 * @group Technique
 * @param {object} object.body - Formulário para adicionar técnica - ex. {"name":"nome da técnica"} 
 * @returns {object} 201 - Nova técnica criada com sucesso!
 * @returns {Error} 400 - Dados em falta
 * @returns {Error} 401 - É preciso estar autenticado
 * @returns {Error} 403 - Utilizador sem permissão
 * @returns {Error} 500 - Algo de errado aconteceu
 * @security Bearer
 */
router.post('/', 
utilities.isAdmin,
[
    body('name').notEmpty().escape(),
], (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        techniqueController.create(req, res);
    } else {
        res.status(404).json({
            errors: errors.array()
        });
    }
})

/**
 * @route GET /techniques/
 * @group Technique
 * @returns {object} 200 - Lista das técnicas - ex: [{name: "Acrílico sobre papel"}, {...}]
 * @returns {Error} 500 - Algo deu errado
 */
router.get('/', (req, res) => {
    techniqueController.getAll(req, res);
})

/**
 * @route GET /techniques/:techniqueID
 * @group Technique
 * @param {object} id.patch - Id da técnica
 * @returns {object} 200 - Técnica pesquisada pelo id - ex: {name: "Acrílico sobre papel"}
 * @returns {Error} 404 - Técnica não existe/encontrado
 * @returns {Error} 500 - Algo de errado aconteceu
 */
router.get('/:techniqueID', (req, res) => {
    techniqueController.findTechnique(req, res);
})

/**
 * @route PUT /techniques/:techniqueID
 * @group Technique
 * @param {object} object.body - Alterar alguma informação da técnica - ex. {"name":"nome da técnica"} 
 * @param {object} id.patch - Id da técnica
 * @returns {object} 200 - Técnica alterada
 * @returns {Error} 401 - É preciso estar autenticado
 * @returns {Error} 403 - Utilizador sem permissão
 * @returns {Error} 404 - Técnica não existe/ não foi encontrada
 * @returns {Error} 500 - Algo de errado aconteceu
 * @security Bearer
 */
router.put('/:techniqueID', utilities.isAdmin, (req, res) => {
    techniqueController.update(req, res);
})

/**
 * @route DELETE /techniques/:techniqueID
 * @group Technique
 * @param {object} id.patch - Id da técnica
 * @returns {object} 204 - Técnica eliminada
 * @returns {Error} 401 - É preciso estar autenticado
 * @returns {Error} 403 - Utilizador sem permissão
 * @returns {Error} 404 - Técnica não existe/ não encontrada
 * @returns {Error} 500 - Algo de errado aconteceu
 * @security Bearer
 */
router.delete('/:techniqueID', utilities.isAdmin, (req, res) => {
    techniqueController.delete(req, res);
})

module.exports = router;