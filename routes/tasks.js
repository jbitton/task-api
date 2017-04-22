import express from 'express';
import * as db from '../db/db';
import ObjectId from 'mongodb';

const router = express.Router();

/* GET tasks listing. */
router.get('/', (req, res) => {
  res.send('respond with a resource');
});

router.get('/:userId', (req, res) => {
  db.Task.find({ owner: ObjectId(req.params.userId) }, (err, tasks) => {
    err || tasks === null
      ? res.status(400).send([])
      : res.status(200).send(tasks);
  });
});

router.post('/new/:userId', (req, res) => {
  const task = db.Task();
  task.title = req.body.title;
  task.description = req.body.description;
  task.subject = req.body.subject;
  task.dueDate = new Date(req.body.dueDate);
  task.completed = false;
  task.owner = ObjectId(req.params.userId);
  task.save((err, task) => {
    err || task === null
      ? res.status(500).send({error: "Error saving task to DB"})
      : res.status(200).send(task);
  });
});

router.patch('/:id', (req, res) => {
  db.Task.findOne({ _id: ObjectId(req.params.id) }, (err, task) => {
    if (err || task === null) {
      res.status(400).send({error: "No Task found for Id"});
    } else {
      const updatedTask = req.body;
      const id = req.params.id;
      db.Task.update({_id  : ObjectId(id)}, {$set: updatedTask}, (err, task) => {
        err || task === null
          ? res.status(500).send({ error: "Error saving Task" })
          : res.status(200).send(task);
      });
    }
  })
});

router.delete('/:id/delete', (req, res) => {
  db.Task.findOne({ _id: req.params.id }, (err, task) => {
    if (err || task === null) {
      res.status(404).send({error: "Task not found"});
    } else {
      task.remove();
      res.status(200).send({ success: "Task deleted" });
    }
  });
});

export default router;