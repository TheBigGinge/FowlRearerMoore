var express = require('express');
var path = require('path');
var webpack = require('webpack');
var app = express();
// var pg = require('pg');
var bodyParser = require('body-parser');
// var multer = require('multer');

var isDevelopment = (process.env.NODE_ENV !== 'production');
var static_path = path.join(__dirname, './dist');

// app.use('/images', express.static(__dirname + '/images'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Setup API
/*
if (isDevelopment) {
  process.env.DATABASE_URL = 'postgres://sixknbsogjnqoz:5b14450def84fead3d307cb453463f85e0ca07114c4eddd69d215c5f4f778ca1@ec2-23-23-237-68.compute-1.amazonaws.com:5432/d3prn68aiagr7s';
}
*/
// var playerController = require('./api/playerController')(app, pg, process.env.DATABASE_URL);
// var gameController = require('./api/gameController')(app, pg, process.env.DATABASE_URL);
// var sessionController = require('./api/sessionController')(app, pg, process.env.DATABASE_URL);
// var voteController = require('./api/voteController')(app, pg, process.env.DATABASE_URL);

app.use(express.static(static_path))
  .get('/', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.sendFile('index-template.html', {
      root: static_path
    });
  }).listen(process.env.PORT || 8080, function (err) {
    if (err) { console.log(err) };
    console.log('Listening at localhost:8080');
  });

if (isDevelopment) {
  var config = require('./webpack.dev.config');
  var WebpackDevServer = require('webpack-dev-server');

  new WebpackDevServer(webpack(config), {
    publicPath: path.resolve(__dirname, './dist'),
    hot: true
  }).listen(3000, 'localhost', function (err, result) {
    if (err) { console.log(err) }
    console.log('Listening at localhost:3000');
  });
}