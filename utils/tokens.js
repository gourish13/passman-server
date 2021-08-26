const jwt = require('jsonwebtoken');

const SECRET = process.env.SECRET;

// Sign Token
exports.signToken = (payload, callback) => {
    jwt.sign(payload, SECRET, { expiresIn: 600 }, callback);
};

// Verify Token Middleware
exports.verifyToken = (req, res, next) => {
    const auth = req.headers.authorize;
    const token = auth && auth.split(' ')[1];
    if (!token)
        res.status(401).json( {status: 'unauthorized'} );
    else
        jwt.verify(token, SECRET, (err, payload) => {
            if (err)
                res.status(401).json( {status: 'unauthorized', err} );
            else
                req.user = payload;
                next();
        });
};
