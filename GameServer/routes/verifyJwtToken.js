const jwt = require('jsonwebtoken');
const config = require('../config/config.js');
const db = require('../config/db.config.js');
const Role = db.role;
const User = db.user;

verifyToken = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    console.log('verify',token, req.headers);
    if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
    }

    if (!token) {
        return res.status(403).send({
            auth: false, message: 'No token provided.'
        });
    }

    console.log(jwt.verify(token, 'JWTSuperSecretKey', { algorithms: ['HS512'] }));

    jwt.verify(token,
        'JWTSuperSecretKey'
        , (err, decoded) => {
            if (err) {
                return res.status(500).send({
                    auth: false,
                    message: 'Fail to Authentication. Error -> ' + err
                });
            }
            req.decoded = decoded.id;
            next();
        });
}

isAdmin = (req, res, next) => {
    User.findById(req.userId)
        .then(user => {
            user.getRoles().then(roles => {
                for (let i = 0; i < roles.length; i++) {
                    console.log(roles[i].name);
                    if (roles[i].name.toUpperCase() === "ADMIN") {
                        next();
                        return;
                    }
                }

                res.status(403).send("Require Admin Role!");
                return;
            })
        })
}

isPmOrAdmin = (req, res, next) => {
    User.findById(req.userId)
        .then(user => {
            user.getRoles().then(roles => {
                for (let i = 0; i < roles.length; i++) {
                    if (roles[i].name.toUpperCase() === "PM") {
                        next();
                        return;
                    }

                    if (roles[i].name.toUpperCase() === "ADMIN") {
                        next();
                        return;
                    }
                }

                res.status(403).send("Require PM or Admin Roles!");
            })
        })
}

const authJwt = {};
authJwt.verifyToken = verifyToken;
authJwt.isAdmin = isAdmin;
authJwt.isPmOrAdmin = isPmOrAdmin;

module.exports = authJwt;