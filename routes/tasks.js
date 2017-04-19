var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectId;
var db = require('../db/db');

/* GET tasks listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

router.get('/:userId', function(req, res) {
  db.Task.find({ 'owner': ObjectId(req.params.userId) }, function (err, tasks) {
    if (err || tasks === null)
      res.status(400).send([]);
    else
      res.status(200).send(tasks);
  });
});

router.post('/new/:userId', function(req, res) {
  var task = db.Task();
  task.title = req.body.title;
  task.description = req.body.description;
  task.subject = req.body.subject;
  task.dueDate = new Date(req.body.dueDate);
  task.completed = false;
  task.owner = ObjectId(req.params.userId);
  task.save(function (err, task) {
    if (err || task === null) {
      res.status(500).send({error: "Error saving task to DB"});
    } else {
      console.log("New Task:");
      console.log("Task title = " + task.title);
      res.status(200).send(task);
    }
  });
});

router.patch('/:id', function(req, res) {
  db.Task.findOne({ '_id': ObjectId(req.params.id) }, function (err, task) {
    if (err || task === null)
      res.status(400).send({ error: "No Task found for Id" });
    else {
      var updatedTask = req.body;
      var id = req.params.id;
      db.Task.update({_id  : ObjectId(id)}, {$set: updatedTask}, function (err, task) {
        if (err || task === null)
          res.status(500).send({ error: "Error saving Task" });
        else
          res.status(200).send(task);
      });
    }
  })
});

router.delete('/:id/delete', function (req, res) {
  db.Task.findOne({ '_id': req.params.id }, function (err, task) {
    if (err || task === null)
      res.status(404).send({ error: "Task not found" });
    else {
      task.remove();
      res.status(200).send({ success: "Task deleted" });
    }
  });
});

module.exports = router;