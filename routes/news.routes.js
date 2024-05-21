const express = require('express');
const router = express.Router();
const newsController = require('../controllers/news.controller.js');
const { validationResult, body } = require('express-validator');
const utilities = require('../utilities/utilities.js');

/**
 * @route GET /news/
 * @group News
 * @returns {object} 200 - Retorna todas as informações das noticias e eventos - ex. [{"name":"Noites Cadillac", "image":"https://www.cupertino.pt/media/4071/tm3c2a8018.jpg?anchor=center&mode=crop&width=555&upscale=false&rnd=133136720280000000", "day":"26-11-2022", "price":"3", "info":"Inserido nos Mário Cesariny - Encontros XVI, realiza-se no sábado, dia 26 de novembro, às 17h30, o espetáculo de Mafalda Veiga, intitulado 𝐍𝐨𝐢𝐭𝐞 𝐂𝐚𝐝𝐢𝐥𝐥𝐚𝐜.", "localization":"Fundação Cupertino de Miranda", "type":"Evento"},...]
 * @returns {Error} 500 - Algo deu errado
 */

router.get('/', (req, res) => {
    newsController.getAll(req, res)
})

/**
 * @route GET /news/type/:type
 * @group News
 * @param {object} type.path - Tipo do jogo
 * @returns {object} 200 - Retorna a informação de uma noticia ou evento pesquisado pelo tipo - ex. [{"name":"Noites Cadillac", "image":"https://www.cupertino.pt/media/4071/tm3c2a8018.jpg?anchor=center&mode=crop&width=555&upscale=false&rnd=133136720280000000", "day":"26-11-2022", "price":"3", "info":"Inserido nos Mário Cesariny - Encontros XVI, realiza-se no sábado, dia 26 de novembro, às 17h30, o espetáculo de Mafalda Veiga, intitulado 𝐍𝐨𝐢𝐭𝐞 𝐂𝐚𝐝𝐢𝐥𝐥𝐚𝐜.", "localization":"Fundação Cupertino de Miranda", "type":"Evento"},...]
 * @returns {Error} 400 - Tipo inválido
 * @returns {Error} 404 - Tipo não encontrado
 * @returns {Error} 500 - Algo deu errado
 */
router.get('/type/:type', (req,res) => {
    newsController.findByType(req,res)
})

/**
 * @route GET /news/:id
 * @group News
 * @returns {object} 200 - Retorna a informação de uma noticia ou evento pesquisado pelo id - ex. {"name":"Noites Cadillac", "image":"https://www.cupertino.pt/media/4071/tm3c2a8018.jpg?anchor=center&mode=crop&width=555&upscale=false&rnd=133136720280000000", "day":"26-11-2022", "price":"3", "info":"Inserido nos Mário Cesariny - Encontros XVI, realiza-se no sábado, dia 26 de novembro, às 17h30, o espetáculo de Mafalda Veiga, intitulado 𝐍𝐨𝐢𝐭𝐞 𝐂𝐚𝐝𝐢𝐥𝐥𝐚𝐜.", "localization":"Fundação Cupertino de Miranda", "type":"Evento"}
 * @returns {Error} 400 - id inválido
 * @returns {Error} 404 - id não encontrado
 * @returns {Error} 500 - Algo deu errado
 */
router.get('/:id', (req,res) => {
    newsController.findById(req, res)
})

/**
 * @route Post /news/
 * @group News
 * @param {object} object.body - Formulário para adicionar nova noticia/evento - ex. {"name":"Surrealismo na praça", "image":"sp.png", "day":"14-02-2023", "price":"0", "info":"Venha conhecer as nossas obras projetadas no jardim atrás da fundação", "localization":"Fundação Cupertino de Miranda", "type":"Evento"}
 * @returns {object} 201 - Novo evento criado com sucesso!
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
    body('day').notEmpty().escape(),
    body('price').notEmpty().escape(),
    body('info').notEmpty().escape(),
    body('localization').notEmpty().escape(),
    body('type').notEmpty().escape(),
] , (req,res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        newsController.create(req,res)
    } else {
        res.status(404).json({errors: errors.array()});
    }
})

/**
 * @route Put /news/:id
 * @group News
 * @param {object} id.path - Formulário para alterar noticia/evento - ex. {"price":"5"}
 * @returns {object} 200 - Noticia alterada
 * @returns {Error} 401 - É preciso estar autenticado
 * @returns {Error} 403 - Utilizador sem permissão
 * @returns {Error} 404 - Noticia não existe/encontrada
 * @returns {Error} 500 - Algo deu errado
 * @security Bearer
 */

router.put('/:id', utilities.isAdmin, (req, res) => {
    newsController.update(req, res);
})

/**
 * @route DELETE /news/:id
 * @group News
 * @param {object} id.delete - Id da noticia
 * @returns {object} 204 - Noticia eliminada
 * @returns {Error} 401 - É preciso estar autenticado
 * @returns {Error} 403 - Utilizador sem permissão
 * @returns {Error} 404 - Noticia não existe/encontrada
 * @returns {Error} 500 - Algo deu errado
 * @security Bearer
 */
router.delete('/:id', utilities.isAdmin, (req, res) => {
    newsController.delete(req, res);
})

module.exports = router;