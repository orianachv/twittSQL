'use strict';
var express = require('express');
var router = express.Router();
//var tweetBank = require('../tweetBank');
var db = require('../db');

// una función reusable
function respondWithAllTweets(req, res, next) {
  db.query(
    'SELECT * FROM tweets INNER JOIN users ON users.id = user_id',
    function(err, result) {
      if (err) return next(err); // pasa el error a Express
      var tweets = result.rows;
      res.render('index', {
        title: 'Twitter.js',
        tweets: tweets,
        showForm: true,
      });
    },
  );
}

// aca basícamente tratamos a la root view y la tweets view como identica
router.get('/', respondWithAllTweets);
router.get('/tweets', respondWithAllTweets);

// página del usuario individual
router.get('/users/:username', function(req, res, next) {
  db.query(
    'SELECT * FROM tweets INNER JOIN users ON users.id = user_id WHERE users.name = $1;',
    [req.params.username],
    function(err, result) {
      if (err) return next(err);
      var tweets = result.rows;
      var name = req.params.username;
      res.render('index', {
        title: 'Twitter.js',
        tweets: tweets,
        showForm: true,
        username: name,
      });
    },
  );
});

// página del tweet individual
router.get('/tweets/:id', function(req, res, next) {
  db.query(
    'SELECT * FROM tweets INNER JOIN users ON users.id = user_id WHERE tweets.id = $1;',
    [Number(req.params.id)],
    function(err, result) {
      if (err) return next(err);
      var tweets = result.rows;
      res.render('index', {
        title: 'Twitter.js',
        tweets: tweets,
        showForm: true,
      });
    },
  );
});

// crear un nuevo tweet

router.post('/tweets', function(req, res, next) {
  db.query('SELECT id FROM users WHERE name = $1', [req.body.name], function(
    err,
    result,
  ) {
    var id = result.rows;
    console.log(req.body.name);
    console.log(req.body.content);
    console.log(id);
    console.log('//---------------//');
    if (req.body.name) {
      db.query(
        'INSERT INTO tweets (user_id, content) VALUES ($1, $2);',
        [id[0].id, req.body.content],
        function(err, result) {
          console.log(req.body.content);
          //console.log(id[0].id)
          res.redirect('/');
        },
      );
    } else {
    }
  });
});

module.exports = router;
// // reemplazá esta ruta hard-codeada con static routing general en app.js
// router.get('/stylesheets/style.css', function(req, res, next){
//   res.sendFile('/stylesheets/style.css', { root: __dirname + '/../public/' });
// });
/*
var newTweet = tweetBank.add(req.body.name, req.body.content);
  res.redirect('/');
  */
