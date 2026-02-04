const jwt = require('jsonwebtoken');

function auth(required = true) {
    return (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            if (required) return res.status(401).json({ error: 'Missing Authorization header' });
            return next();
        }

        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ error: 'Malformed Authorization header' });

        const token = parts[1];
        const secret = process.env.JWT_SECRET;
        if (!secret) return res.status(500).json({ error: 'Server missing JWT secret' });

        jwt.verify(token, secret, (err, payload) => {
            if (err) return res.status(401).json({ error: 'Invalid token' });
            req.user = payload;
            next();
        });
    };
}

module.exports = auth;