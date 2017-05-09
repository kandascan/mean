var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var router = express.Router();
var appRoutes = require('./app/routes/api')(router);
var path = require('path');

// logger 
var morgan = require('morgan');
app.use(morgan('dev'));

// database configuration
var mongoose = require('mongoose');
var mongoUser = 'mywallet';
var mongoPass = 'h2h4wkrpfv';
var mongoDatabase = 'mywallet';

//body parser to parsing data to json object
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use('/api', appRoutes);
mongoose.connect('mongodb://'+mongoUser+':'+mongoPass+'@ds131511.mlab.com:31511/'+mongoDatabase, function(err){
    if(err){
        console.log("Not connected to the database: " + err);
    } else{
        console.log("Connected to MongoDB");
    }
});

app.get('*', function(req, res){
    res.sendfile(path.join(__dirname + '/public/app/views/index.html'));
});

// server listening
app.listen(port, function(){
    console.log("Running the server on port " + port);
});