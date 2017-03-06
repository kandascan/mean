var User = require('../models/user');

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
                        res.json({ success: true, message: 'User authenticated' });
                    }
                } else {
                    res.json({ success: false, message: 'No password provided' });
                }
            }
        });
    });

    return router;
}