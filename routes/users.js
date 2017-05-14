import express from 'express';
import bcrypt from 'bcrypt';
import * as db from '../db/db';
import ObjectId from 'mongodb';

const router = express.Router();

/* GET users listing. */
router.get('/', (req, res) => res.send('respond with a resource'));

router.get('/:id', (req, res) =>
  db.User.findOne({ _id: ObjectId(req.params.id)}, (err, user) =>
    err || user === null
      ? res.status(400).send({ error: "No User found for Id" })
      : res.status(200).send(user)));

router.post('/new', (req, res) => {
  const user = new db.User();
  user.userName = req.body.userName;
  user.password = req.body.password;
  user.email = req.body.email;
  user.save((err, user) =>
    err || user === null
      ? res.status(500).send({ error: "Error saving user to DB" })
      : res.status(200).send(user));
});

router.post('/login', (req, res) => {
  const userName = req.body.userName;
  const password = req.body.password;
  db.User.findOne({ userName }, (err, user) =>
    err || user === null
      ? res.status(404).send({ error: "User not found" })
      : bcrypt.compare(password, user.password, (error, isMatch) =>
          error
            ? res.status(error.status).send({ error })
            : isMatch
              ? res.status(200).json(user)
              : res.status(403).send({ error: "Incorrect password" })));
});

router.patch('/:id', (req, res) =>
  db.User.findOne({ _id: ObjectId(req.params.id) }, (err, user) => {
    if (err || user === null) {
      res.status(400).send({error: "No User found for Id"});
    } else {
      const updatedUser = req.body;
      const id = req.params.id;
      db.User.update({ _id: ObjectId(id)}, {$set: updatedUser}, (err, user) =>
        err || user === null
          ? res.status(500).send({ error: "Error saving Task" })
          : res.status(200).send(user));
    }
  }));

export default router;
