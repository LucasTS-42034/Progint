const jwt = require('jsonwebtoken');

class JWTUtils {
    static generateToken(payload) {
        return jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });
    }

    static verifyToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            throw new Error('Token inválido');
        }
    }

    static extractToken(req) {
        const authHeader = req.headers.authorization;
        if (!authHeader) return null;
        
        return authHeader.split(' ')[1];
    }
}

module.exports = JWTUtils;