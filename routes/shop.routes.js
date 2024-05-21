const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shop.controller.js')
const { validationResult, body } = require('express-validator')
const utilities = require('../utilities/utilities.js');

/**
 * @route GET /shop/
 * @group Shop
 * @returns {object} 200 - Retorna todas as trocas disponiveis - ex. [{"name":"20% desconto no bilhete geral", "discount":"20", "amountPoints":"950", "info":" Com este desconto poderás obter um código de desconto no bilhete geral de visita da nossa Fundação! Vem ver os quadros que temos para te mostrar", "traded": false},{...}]
 * @returns {Error} 400 - Erro inesperado
 * @returns {Error} 500 - Algo deu errado
 */

router.get('/', (req, res) => {
    shopController.getAll(req, res)
})

/**
 * @route GET /shop/:id
 * @group Shop
 * @returns {object} 200 - Retorna a informação de uma troca pesquisado pelo id - ex. {"name":"20% desconto no bilhete geral", "discount":"20", "amountPoints":"950", "info":" Com este desconto poderás obter um código de desconto no bilhete geral de visita da nossa Fundação! Vem ver os quadros que temos para te mostrar","traded": false}
 * @returns {Error} 400 - id inválido
 * @returns {Error} 404 - id não encontrado
 * @returns {Error} 500 - Algo deu errado
 */
router.get('/:id', (req,res) => {
    shopController.findById(req, res)
})

/**
 * @route Post /shop/
 * @group Shop
 * @param {object} object.body - Formulário para adicionar nova troca - ex. {"name":"Livro FCM", "discount":"100", "amountPoints":"2000", "info":" Um livro inspirado nas obras presentes da Fundação, onde podes deixar-te levar pela tua criatividade", "traded": false}
 * @returns {object} 201 - Nova troca criada com sucesso!
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
    body('discount').notEmpty().escape(),
    body('info').notEmpty().escape(),
] , (req,res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        shopController.create(req,res)
    } else {
        res.status(404).json({errors: errors.array()});
    }
})

/**
 * @route Put /shop/:id
 * @group Shop
 * @param {object} id.path - Formulário para alterar troca - ex. {"discount":"40"}
 * @returns {object} 200 - Troca alterada
 * @returns {Error} 401 - É preciso estar autenticado
 * @returns {Error} 403 - Utilizador sem permissão
 * @returns {Error} 404 - Troca não existe/encontrada
 * @returns {Error} 500 - Algo deu errado
 * @security Bearer
 */

router.put('/:id', utilities.validateToken, (req, res) => {
    shopController.update(req, res);
})

/**
 * @route DELETE /shop/:id
 * @group Shop
 * @param {object} id.delete - Id da troca
 * @returns {object} 204 - Troca eliminada
 * @returns {Error} 401 - É preciso estar autenticado
 * @returns {Error} 403 - Utilizador sem permissão
 * @returns {Error} 404 - Troca não existe/encontrada
 * @returns {Error} 500 - Algo deu errado
 * @security Bearer
 */
router.delete('/:id', utilities.isAdmin, (req, res) => {
    shopController.delete(req, res);
})

module.exports = router;