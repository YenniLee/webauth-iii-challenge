const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Users = require('../users/users-model');
const restricted = require('../auth/restricted-middleware');

router.post('/register', (req, res) => {
    let user = req.body;
    const hash = bcrypt.hashSync(user.password, 12);
    user.password = hash;

    Users.add(user)
        .then(savedUser => {
            res.status(201).json(savedUser);
        })
        .catch(err => {
            res.status(500).json(err);
        })
});

router.post('/login', (req, res) => {
    let { username, password } = req.body;

    Users.findBy({ username })
        .first()
        .then(user => {
            console.log(user)
            if (user && bcrypt.compareSync(password, user.password)) {
                const token = generateToken(user);
                res.status(200).json({
                    token: token,
                    message: `Welcome ${user.username}!`
                })
            } else {
                res.status(401).json({ message: 'You shall not pass.' })
            }
        })
        .catch(err => {
            console.log(err)

            res.status(500).json({ message: `Unable to login. ${err}` });
        });
});

router.get('/users', restricted, (req, res) => {
    Users.find()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => res.status(500).json(err))
});

function generateToken(user) {
    const jwtSecret = process.env.JWT_SECRET || 'totalmystery';
    const payload = {
        userid: user.id, 
        username: user.username,
        department: user.department
    };

    const options = { expiresIn: '8h' };
    const token = jwt.sign(payload, jwtSecret, options);

    return token;
}

module.exports = router;
