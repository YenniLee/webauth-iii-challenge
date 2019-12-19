const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const jwtSecret = process.env.JWT_SECRET || 'totalmystery';
    const token = req.headers.authorization;

    if (token) {
        jqt.verify(toke, jwtSecret, (err, decodedToken) => {
            if (err) {
                res.status(401).json({ message: "You shall not pass!" });
            } else {
                req.decodedJwt = decodedToken;
                next();
            }
        })
    } else {
        res.status(401).json({ message: "You really cannot enter." })
    }
};