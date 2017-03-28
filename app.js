var express = require('express')
var app = express()
var cache = require('apicache').middleware
var fs = require('fs');
var sharp = require('sharp')
var fetch = require('node-fetch');
var svg2png = require("svg2png");
var screeps = require('./services/screeps.js')
var badges = require('./services/badges.js')
var league = require('./services/league.js')
var settings = require('./.settings.json')

screeps.username = settings['email']
screeps.password = settings['password']

var httpcache = 30 * 60 // time in seconds
var httpmaxstale = 30 * 24 * 60 * 60
var cachetime = '45 minutes'
var badge_size = 250
var alliance_watermark_size = Math.round(badge_size/3)


/* Basic Intro Page */
app.get('/', function (req, res) {
  var data = fs.readFileSync('./html/index.html', 'utf-8');
  res.send(data)
})

/* Display in browser */
app.get('/users/:username.html', cache(cachetime), function (req, res) {
  badges.getBadgeByName(req.params['username'], badge_size)
  .then(function(xml){
    res.send(xml)
  })
})

/* Create SVG File with proper content headers */
app.get('/users/:username.svg', cache(cachetime), function (req, res) {
  badges.getBadgeByName(req.params['username'], badge_size)
  .then(function(xml){
    res.setHeader("Cache-Control", "public, max-age="+httpcache+", max-stale="+httpmaxstale);
    res.setHeader("Expires", new Date(Date.now() + httpcache*1000).toUTCString());
    res.setHeader('content-type', 'image/svg+xml');
    res.send(xml)
  })
})

/* Create PNG File with proper content headers */
app.get('/users/:username.png', cache(cachetime), function (req, res) {
  console.log('user badge')
  badges.getBadgeByName(req.params['username'], badge_size)
  .then(svg2png)
  .then(function(buffer){
    res.setHeader("Cache-Control", "public, max-age="+httpcache+", max-stale="+httpmaxstale);
    res.setHeader("Expires", new Date(Date.now() + httpcache*1000).toUTCString());
    res.setHeader('content-type', 'image/png');
    res.send(buffer)
  })
})

/* Create PNG File that includes the alliance logo */
app.get('/alliances/:username.png', cache(cachetime), function (req, res) {
  var user = req.params['username']
  var badgeImageBuffer = false
  badges.getBadgeByName(req.params['username'], badge_size)
  .then(svg2png)
  .then(function(buffer){
    badgeImageBuffer = sharp(buffer)
    var alliance = league.getUserAlliance(user)
    if(alliance) {
      var url = league.getLogoUrl(alliance)
      if(!!url) {
        return fetch(url)
        .then(function(res){
          return res.buffer()
        })
      }
    }
    return false
  })
  .then(function(alliance_image){
    if(alliance_image) {
      var allianceImage = sharp(alliance_image)
      return allianceImage.resize(alliance_watermark_size,alliance_watermark_size)
      .toBuffer()
      .then(function(allianceBuffer){
        badgeImageBuffer.overlayWith(allianceBuffer, {
          gravity: sharp.gravity.southeast
        })
        return badgeImageBuffer.toBuffer()
      })
    }
    return badgeImageBuffer.toBuffer()
  })
  .then(function(buffer){
    res.setHeader("Cache-Control", "public, max-age="+httpcache+", max-stale="+httpmaxstale);
    res.setHeader("Expires", new Date(Date.now() + httpcache*1000).toUTCString());
    res.setHeader('content-type', 'image/png');
    res.send(buffer)
  })
  .catch(function(err){
    console.log(err.message)
    console.log(err.stack)
  })
})

process.on('uncaughtException', function(err) {
    console.log(err);
});


var port = process.env.PORT || 3000
app.listen(port, function () {
  console.log('Example app listening on port ' + port + '!')
})
