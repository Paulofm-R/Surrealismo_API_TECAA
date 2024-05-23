const express = require('express');
const router = express.Router();
const gameController = require('../controllers/games.controller.js')
const { validationResult, body } = require('express-validator')
const utilities = require('../utilities/utilities.js');

/**
 * @route POST /games/
 * @group Games - Operações relacionadas a jogos
 * @summary Criar um novo jogo
 * @param {GamePost.model} object.body - Formulario para criar o jogo 
 * @returns {object} 201 - Novo Jogo criado com sucesso!
 * @returns {Error} 400 - Dados em falta
 * @returns {Error} 401 - É preciso estar autenticado
 * @returns {Error} 403 - Utilizador sem permissão
 * @returns {Error} 500 - Algo deu errado
 * @security Bearer
 */
/**
 * @typedef GamePost
 * @property {string} name.required - Nome do jogo
 * @property {string} image.required - URL da imagem do jogo
 * @property {string} type.required - Tipo do jogo
 * @property {number} points.required - Pontos totais do jogo
 * @property {Array.<Question>} questions.required - Lista de perguntas do jogo
 */
router.post('/',
    utilities.isAdmin,
    [
        body('name').notEmpty().escape(),
        body('image').notEmpty().escape(),
        body('questions').notEmpty(),
        body('points').notEmpty().escape(),
    ], (req, res) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            gameController.create(req, res);
        } else {
            res.status(404).json({ errors: errors.array() });
        }
    })

/**
 * @route GET /games/
 * @group Games - Operações relacionadas a jogos
 * @summary Obtém a lista de todos os jogos
 * @returns {Array.<Game>} 200 - Lista de jogos com sucesso
 * @returns {Error} 401 - Autenticação necessária
 * @returns {Error} 500 - Erro interno do servidor
 * @security Bearer
 * @example response - 200 - Exemplo de resposta bem-sucedida
 * [
 *   {
 *     "name": "Conheces o nome de todas as obras?",
 *     "image": "https://phyrowns.sirv.com/Surrealismo/FCM00284.jpg",
 *     "type": "Quiz"
 *   },
 *   {
 *     "name": "Aventuras no Mundo dos Jogos",
 *     "image": "https://phyrowns.sirv.com/Aventura/Adventure001.jpg",
 *     "type": "Aventura"
 *   }
 * ]
 */
/**
 * @typedef Game
 * @property {string} name.required - Nome do jogo
 * @property {string} image.required - URL da imagem do jogo
 * @property {string} type.required - Tipo do jogo
 */
router.get('/', utilities.validateToken, (req, res) => {
    gameController.getAll(req, res);
})

/**
 * @route GET /games/:gameID
 * @group Games - Operações relacionadas a jogos
 * @summary Obtém informações detalhadas de um jogo específico pelo ID
 * @param {string} gameID.path.required - ID do jogo
 * @returns {GameDetail.model} 200 - Informação detalhada do jogo pesquisado pelo ID
 * @returns {Error} 401 - Autenticação necessária
 * @returns {Error} 404 - Jogo não encontrado
 * @returns {Error} 500 - Erro interno do servidor
 * @security Bearer
 * @example response - 200 - Exemplo de resposta bem-sucedida
 * {
 *   "name": "Conheces o nome de todas as obras?",
 *   "image": "https://phyrowns.sirv.com/Surrealismo/FCM00284.jpg",
 *   "type": "Quiz",
 *   "points": 100,
 *   "questions": [
 *     {
 *       "questionID": "q1",
 *       "question": "Qual é a capital da França?",
 *       "options": ["Paris", "Londres", "Berlim", "Madrid"],
 *       "answer": "Paris"
 *     },
 *     {
 *       "questionID": "q2",
 *       "question": "Qual é o maior planeta do Sistema Solar?",
 *       "options": ["Terra", "Marte", "Júpiter", "Saturno"],
 *       "answer": "Júpiter"
 *     }
 *   ],
 *   "leaderboard": [
 *     {
 *       "userID": "user123",
 *       "points": 80
 *     },
 *     {
 *       "userID": "user456",
 *       "points": 70
 *     }
 *   ]
 * }
 */
/**
 * @typedef GameDetail
 * @property {string} name.required - Nome do jogo
 * @property {string} image.required - URL da imagem do jogo
 * @property {string} type.required - Tipo do jogo
 * @property {number} points.required - Pontos totais do jogo
 * @property {Array.<Question>} questions.required - Lista de perguntas do jogo
 * @property {Array.<LeaderboardEntry>} leaderboard.required - Classificação dos jogadores
 */
/**
 * @typedef Question
 * @property {string} questionID.required - ID da pergunta
 * @property {string} question.required - Texto da pergunta
 * @property {Array.<string>} options.required - Opções de resposta
 * @property {string} answer.required - Resposta correta
 */
/**
 * @typedef LeaderboardEntry
 * @property {string} userID.required - ID do usuário
 * @property {number} points.required - Pontos do usuário
 */
router.get('/:gameID', utilities.validateToken, (req, res) => {
    gameController.findGame(req, res);
});

/**
 * @route GET /games/type/:type
 * @group Games - Operações relacionadas a jogos
 * @summary Buscar uma lista de jogos pelo tipo
 * @param {object} type.path - Tipo do jogo
 * @returns {Array.<GameDetail>} 200 - Lista de jogos do "type" passado como parametro
 * @returns {Error} 400 - Tipo inválido
 * @returns {Error} 404 - Tipo não encontrado
 * @returns {Error} 500 - Algo deu errado
 * @security Bearer
 */
router.get('/type/:type', (req, res) => {
    gameController.findByType(req, res)
})

/**
 * @route PUT /games/:gameID
 * @group Games - Operações relacionadas a jogos
 * @summary Alterar algumas informações do jogo
 * @param {GamePut.model} game.body.required - Alterar algumas informações do game
 * @param {object} id.path.required  - Id do jogo
 * @returns {object} 200 - Jogo alterado
 * @returns {Error} 401 - É preciso estar autenticado
 * @returns {Error} 403 - Utilizador sem permissão
 * @returns {Error} 404 - Jogo não existe/encontrado
 * @returns {Error} 500 - Algo deu errado
 * @security Bearer
 */
/**
 * @typedef GamePut
 * @property {string} name - Nome do jogo
 * @property {string} image - URL da imagem do jogo
 * @property {number} points - Pontos totais do jogo
 * @property {Array.<Question>} questions - Lista de perguntas do jogo
 */
router.put('/:gameID', utilities.validateToken, (req, res) => {
    gameController.update(req, res);
})

/**
 * @route DELETE /games/:gameID
 * @group Games - Operações relacionadas a jogos
 * @summary Exclui um jogo específico pelo ID
 * @param {string} gameID.path.required - ID do jogo
 * @returns {object} 204 - Jogo eliminado
 * @returns {Error} 401 - Autenticação necessária
 * @returns {Error} 403 - Permissão negada
 * @returns {Error} 404 - Jogo não encontrado
 * @returns {Error} 500 - Erro interno do servidor
 * @security Bearer
 */
router.delete('/:gameID', utilities.isAdmin, (req, res) => {
    gameController.delete(req, res);
});

module.exports = router;