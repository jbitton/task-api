var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var db = require('../db/db');
var ObjectId = require('mongodb').ObjectId;

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

router.get('/:id', function (req, res) {
  db.User.findOne({ '_id': ObjectId(req.params.id)}, function (err, user) {
    if (err || user === null)
      res.status(400).send({ error: "No User found for Id" });
    else
      res.status(200).send(user);
  });
});

router.post('/new', function(req, res) {
  var user = new db.User();
  user.userName = req.body.userName;
  user.password = req.body.password;
  user.email = req.body.email;
  user.save(function (err, user) {
    if (err || user === null) {
      res.status(500).send({ error: "Error saving user to DB" });
    } else {
      console.log("New User:");
      console.log("User name = " + user.userName + ", password is " + user.password);
      res.status(200).send(user);
    }
  });
});

router.post('/login',function(req, res){
  var userName = req.body.userName;
  var password = req.body.password;
  db.User.findOne({ 'userName': userName }, function (err, user) {
    if (err || user === null)
      res.status(404).send({ error: "User not found" });
    else {
      bcrypt.compare(password, user.password, function(err, isMatch) {
        if (err)
          res.status(err.status).send({ error: err });
        else {
          if(isMatch)
            res.status(200).json(user);
          else
            res.status(403).send({ error: "Incorrect password" });
        }
      });
    }
  });
});

router.patch('/:id', function(req, res) {
  db.User.findOne({ '_id': ObjectId(req.params.id) }, function (err, user) {
    if (err || user === null)
      res.status(400).send({ error: "No User found for Id" });
    else {
      var updatedUser = req.body;
      var id = req.params.id;
      db.User.update({_id  : ObjectId(id)}, {$set: updatedUser}, function (err, user) {
        if (err || user === null)
          res.status(500).send({ error: "Error saving Task" });
        else
          res.status(200).send(user);
      });
    }
  })
});

module.exports = router;
