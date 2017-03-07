var User = require('../models/user');
var jwt = require('jsonwebtoken');
var secret = 'tajne';

// user registration with encrypting password and validation on server site
// localhost:8080/api/users
module.exports = function(router){
    // user registration route
    router.post('/users', function(req, res){
        var user = new User();
        user.username = req.body.username;
        user.password = req.body.password;
        user.email = req.body.email;
        if(req.body.username == null || req.body.username == ''
        || req.body.password == null || req.body.password == ''
        || req.body.email == null || req.body.email == ''){
            res.json({ success: false, message: 'Ensuere username, email and password were provided' });
        } else{
            user.save(function(err){
                if(err){
                    res.json({ success: false, message: 'Username or Email already exists!' })
                }else{
                    res.json({ success: true, message: 'user created' })
                }
            });
        }
    });

    // user login route
    router.post('/authenticate', function(req, res){
        User.findOne({ username: req.body.username }).select('email password username').exec(function(err, user) {
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

    router.use(function(req, res, next) {

        var token = req.body.token || req.body.query || req.headers['x-access-token'];

        if(token) {
            jwt.verify(token, secret, function(err, decoded) {
                if(err) {
                    res.json({ success: false, message: 'Token invalid'});
                } else {
                    req.decoded = decoded;
                    next();
                }
            })
        } else {
            res.json({ success: false, message: 'No token provided' });
        }
    });

    router.post('/me', function(req, res) {
        res.send(req.decoded);
    });

    return router;
}