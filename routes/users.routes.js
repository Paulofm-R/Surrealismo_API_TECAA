const express = require('express');
const router = express.Router();
const userController = require('../controllers/users.controller.js')
const { validationResult, body } = require('express-validator')
const utilities = require('../utilities/utilities.js')

/**
 * @route POST /users/login
 * @group Users
 * @param {object} object.body - Credenciais do utilizador - ex. {"name":"admin", "password":"12345"}
 * @returns {object} 200 - Bearer Token
 * @returns {Error} 400 - Credenciais em falta
 * @returns {Error} 401 - Credenciais incorretas 
 * @returns {Error} 500 - Algo deu errado
 */
router.post('/login', (req, res) => {
    userController.login(req, res)
})

/**
 * @route POST /users/register
 * @group Users
 * @param {object} object.body - Formulario para criar o utilizador - ex. {"name":"admin", "email": "user@example.com", "password":"1234", "birthDate": "AAAA-MM-DD", "locality": "Porto"} 
 * @returns {object} 201 - Novo Utilizador criado com sucesso.
 * @returns {Error} 400 - Dados em falta
 * @returns {Error} 500 - Algo deu errado
 */
router.post('/register', [
    body('name').notEmpty().escape(),
    body('password').notEmpty().escape(),
    body('email').isEmail(),
    body('birthDate').notEmpty().escape(),
    body('locality').notEmpty().escape(),
], (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        userController.register(req, res);
    } else {
        res.status(404).json({errors: errors.array()});
    }
})

/**
 * @route GET /users/
 * @group Users
 * @returns {object} 200 - Lista de utilizadores - ex. [{"name":"admin", "image": "admin.png", "type":"admin"}, {...}]
 * @returns {Error} 401 - É preciso estar autenticado
 * @returns {Error} 403 - Utilizador sem permissão
 * @returns {Error} 500 - Algo deu errado
 * @security Bearer
 */
router.get('/', utilities.isAdmin, (req, res) => {
    userController.getAll(req, res);
})

/**
 * @route GET /users/:userID
 * @group Users
 * @param {object} id.path - Id do utilizador
 * @returns {object} 200 - Informação do utilizador pesquisado pelo id - ex. {"name":"admin", "email":"admin@example.com", "password":"password" "image": "admin.png", "birthday": "2000-09-16", "locality":"Vila do Conde", "type":"admin", "active": true, "points": 300, "gamesPlayes": [{"gameID": "63c820b81c3f4b3327fbf0dc", "timesPlayed": 3}, {...}], exhanges:[{"exhangeID":"63ac9605a8d5fbdb125b8406", "fulfilled":false}, ...], "favoritesArt":[{"artID": "artID"}, ...], "favoritesArtist":[{"artID": "artID"}, ...], "favoritesNew":[{"artID": "artID"}, ...]} 
 * @returns {Error} 401 - É preciso estar autenticado
 * @returns {Error} 403 - Utilizador sem permissão
 * @returns {Error} 404 - Utilizador não existe/encontrado
 * @returns {Error} 500 - Algo deu errado
 * @security Bearer
 */
router.get('/:userID', utilities.validateToken, (req, res) => {
    userController.findUser(req, res);
})

/**
 * @route PUT /users/:userID
 * @group Users
 * @param {object} object.body - Altera as informações do utilizador - ex. {"password": "123456", "email": "adim@example.com", "image": "image.jpg", "locality": "Gaia", "type": "admin"}
 * @param {object} id.path - Id do utilizador
 * @returns {object} 200 - Utilizador alterado
 * @returns {Error} 401 - É preciso estar autenticado
 * @returns {Error} 403 - Utilizador sem permissão
 * @returns {Error} 404 - Utilizador não existe/encontrado
 * @returns {Error} 500 - Algo deu errado
 * @security Bearer
 */
router.put('/:userID', utilities.validateToken, (req, res) => {
    userController.update(req, res);
})

/**
 * @route DELETE /users/:userID
 * @group Users
 * @param {object} id.path - Id do utilizador
 * @returns {object} 204 - Utilizador eliminado
 * @returns {Error} 401 - É preciso estar autenticado
 * @returns {Error} 403 - Utilizador sem permissão
 * @returns {Error} 404 - Utilizador não existe/encontrado
 * @returns {Error} 500 - Algo deu errado
 * @security Bearer
 */
router.delete('/:userID', utilities.validateToken, (req, res) => {
    userController.delete(req, res);
})

module.exports = router;