var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('./services/jwt.js');


var app = express();

app.use(bodyParser.json());

/*
 * custom middleware for cross origin request - start here
 */

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  next();

})
/*
 * end here
 */


/*
 * using bcrypt-nodejs module to hash password - start here
 */

var UserSchema = new mongoose.Schema({
  email: String,
  password: String
})

//hide the password when response - start here

UserSchema.methods.toJSON = function () {
  var user = this.toObject();
  delete user.password;

  return user;
}
//end eher

var User = mongoose.model('User', UserSchema);

UserSchema.pre('save', function (next) {
  var user = this;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, null, function (err, hash) {
      if (err) return next(err);

      user.password = hash;
      next();
    })
  })
})
/*
 * end here
 */


app.post('/register', function (req, res) {
  var user = req.body;

  var newUser = new User({
    email: user.email,
    password: user.password
  });

  var payload = {
    iss: req.hostname,
    sub: newUser.id
  }

  var token = jwt.encode(payload, "secret_key");

  newUser.save(function (err) {
    res.status(200).send({
      user: newUser.toJSON(),
      token: token
    });
  })
})

/*
 * securing the job resource start here
 */
var jobs = [
  'Cook',
  'SuperHero',
  'Unicorn Wisper',
  'Toast Inspector'
];

app.get('/jobs', function (req, res) {

  if (!req.headers.authorization) {
    return res.status(401).send({
      message: 'You are not authorized'
    });
  }

  var token = req.headers.authorization.split(' ')[1];
  var payload = jwt.decode(token, "secret_key");

  if (!payload.sub) {
    res.status(401).send({
      message: 'Authorization failed'
    });
  }

  res.json(jobs);
})
/*
 * end here
 */


mongoose.connect('mongodb://localhost/jwtAngularNodeApp');

var server = app.listen(3000, function () {
  console.log('api is listening on ', server.address().port);
})