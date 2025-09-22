const jwt = require('jsonwebtoken');

const CHAVE_SECRETA = 'senai123';

function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ mensagem: 'Acesso negado! Token não fornecido.' });
  }

  try {
    const decoded = jwt.verify(token, CHAVE_SECRETA);
    req.usuarioId = decoded.id; 
    next(); 
  } catch (error) {
    return res.status(403).json({ mensagem: 'Token inválido ou expirado.' });
  }
}

module.exports = verificarToken;