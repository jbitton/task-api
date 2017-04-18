var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var constants = require('../constants');
var instance;

SALT_WORK_FACTOR = 10;

// User
var UserSchema = mongoose.Schema({
  userName: String,
  password: String,
  email: String
});

var TaskSchema = mongoose.Schema({
  title: String,
  description: String,
  subject: String,
  dueDate: Date,
  completed: Boolean,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

UserSchema.pre('save', function(next) {
  var user = this;
  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();
  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);
    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);
      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

module.exports.startDB = function () {
  mongoose.connect(constants.DB_PROTOCOL +
    constants.DB_USER + ':' +
    constants.DB_PWD +
    constants.DB_INSTANCE);
  var db = mongoose.connection;
  instance = db;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    console.log("Openned connection to " + constants.DB_INSTANCE);
    console.log("DB User:" + constants.DB_USER);
    // Schema exports
    var User = mongoose.model('User', UserSchema);
    var Task = mongoose.model('Task', TaskSchema);
    module.exports.User = User;
    module.exports.Task = Task;
  });
  return db;
};

module.exports.disconnectDB = function () {
  instance = null;
};