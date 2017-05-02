var User = require('../models/user');
var Cost = require('../models/cost');
var CostType = require('../models/costtype');
var jwt = require('jsonwebtoken');
var secret = 'tajne';

module.exports = function (router) {
    // cost add
    router.post('/costs', function (req, res) {
        var cost = new Cost();
        cost.username = req.body.username;
        cost.costname = req.body.costname;
        cost.costprice = req.body.costprice;
        cost.paydate = req.body.paydate;
        cost.costtype = req.body.costtype;
        cost.costdescription = req.body.costdescription;

        cost.save(function (err) {
            if (err) {
                res.json({ success: false, message: 'Jakiś jebany error' })
            } else {
                res.json({ success: true, message: 'cost created' })
            }
        });

    });

    router.get('/costs/:name', function (req, res) {
        var name = req.params.name;
        Cost.find({ 'username': name }).exec(function (err, data) {
            if (err) {
                return res.send(500, err);
            }
            return res.send(data);
        });
    });

    // cost type
    router.post('/coststype', function (req, res) {
        var costtype = new CostType();
        costtype.name = req.body.name;

        costtype.save(function (err) {
            if (err) {
                res.json({ success: false, message: 'Jakiś jebany error' })
            } else {
                res.json({ success: true, message: 'cost created' })
            }
        });

    });

    router.get('/coststype', function (req, res) {
        CostType.find().exec(function (err, data) {
            if (err) {
                return res.send(500, err);
            }
            return res.send(data);
        });
    });
    // user registration with encrypting password and validation on server site
    // localhost:8080/api/users
    // user registration route
    router.post('/users', function (req, res) {
        var user = new User();
        user.username = req.body.username;
        user.password = req.body.password;
        user.email = req.body.email;
        if (req.body.username == null || req.body.username == ''
            || req.body.password == null || req.body.password == ''
            || req.body.email == null || req.body.email == '') {
            res.json({ success: false, message: 'Ensuere username, email and password were provided' });
        } else {
            user.save(function (err) {
                if (err) {
                    res.json({ success: false, message: 'Username or Email already exists!' })
                } else {
                    res.json({ success: true, message: 'user created' })
                }
            });
        }
    });

    // user login route
    router.post('/authenticate', function (req, res) {
        User.findOne({ username: req.body.username }).select('email password username').exec(function (err, user) {
            if (err) {
                throw err;
            }
            if (!user) {
                res.json({ success: false, message: 'Could not authenticate user' });
            } else if (user) {
                if (req.body.password) {
                    var validPassword = user.comparePassword(req.body.password);
                    if (!validPassword) {
                        res.json({ success: false, message: 'Could not authenticate password' });
                    } else {
                        var token = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '24h' });
                        res.json({ success: true, message: 'User authenticated', token: token });
                    }
                } else {
                    res.json({ success: false, message: 'No password provided' });
                }
            }
        });
    });

    router.use(function (req, res, next) {

        var token = req.body.token || req.body.query || req.headers['x-access-token'];

        if (token) {
            jwt.verify(token, secret, function (err, decoded) {
                if (err) {
                    res.json({ success: false, message: 'Token invalid' });
                } else {
                    req.decoded = decoded;
                    next();
                }
            })
        } else {
            res.json({ success: false, message: 'No token provided' });
        }
    });

    router.post('/me', function (req, res) {
        res.send(req.decoded);
    });

    return router;
}
