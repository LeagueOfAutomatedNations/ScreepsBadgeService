var express = require('express')
var app = express()
var cache = require('apicache').middleware
var fs = require('fs');
var svg2png = require("svg2png");
var screeps = require('./services/screeps.js')
var badges = require('./services/badges.js')
var settings = require('./.settings.json')
screeps.username = settings['email']
screeps.password = settings['password']

var cachetime = '45 minutes'

/* Basic Intro Page */
app.get('/', function (req, res) {
  var data = fs.readFileSync('./html/index.html', 'utf-8');
  res.send(data)
})

/* Display in browser */
app.get('/users/:username.html', cache(cachetime), function (req, res) {
  badges.getBadgeByName(req.params['username'])
  .then(function(xml){
    res.send(xml)
  })
})

/* Create SVG File with proper content headers */
app.get('/users/:username.svg', cache(cachetime), function (req, res) {
  badges.getBadgeByName(req.params['username'])
  .then(function(xml){
    res.setHeader('content-type', 'image/svg+xml');
    res.send(xml)
  })
})

/* Create PNG File with proper content headers */
app.get('/users/:username.png', cache(cachetime), function (req, res) {
  badges.getBadgeByName(req.params['username'])
  .then(svg2png)
  .then(function(buffer){
    res.setHeader('content-type', 'image/png');
    res.send(buffer)
  })
})


process.on('uncaughtException', function(err) {
    console.log(err);
});


var port = process.env.PORT || 3000
app.listen(port, function () {
  console.log('Example app listening on port ' + port + '!')
})
