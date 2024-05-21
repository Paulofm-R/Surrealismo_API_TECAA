let jwt = require('jsonwebtoken');
let secret = process.env.SECRET;
const User = require('../models/users.model.js');

const generateToken = (user_info) => {
    let token = jwt.sign({
        data: user_info,
    }, secret, {expiresIn: '24h'});
    return token; 
}

const validateToken = async (req, res, next) => {
    const header = req.headers['x-access-token'] || req.headers.authorization;
    if (typeof header === 'undefined') {
        return res.status(401).json({success: false, message: 'Nenhum token fornecido!'})
    }
    const bearer = header.split(' ');
    const token = bearer[1];
    try {
        let decoded = jwt.verify(token, secret);
        const user = await User.findById(decoded.data.id).select('type').exec();

        if (!user) {
            return res.status(404).json({success: false, msg: "Email invalido"});
        }

        req.userID = decoded.data.id;
        req.userType = user.type;
        return next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({success: false, message: "Ops, seu token expirou! Por favor faça login novamente"})
        } else if (err.name === "JsonWebTokenError") {
            return res.status(401).json({success: false, message: "JWT mal formado"});
        } else {
            return res.status(401).json({success: false, message: "Não autorizado!"})
        }
    }
}

const isAdmin = async (req, res, next) => {
    await validateToken(req, res, next);
    if (req.userType === 'admin') {
      return next();
    } else {
        return res.status(401).json({success: false, message: "Utilizador sem premissão!"})
    }
};

exports.generateToken = generateToken;
exports.validateToken = validateToken;
exports.isAdmin = isAdmin;