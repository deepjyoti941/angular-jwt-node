var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jwt-simple');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var request = require('request');
var moment = require('moment');


var app = express();

app.use(bodyParser.json());
app.use(passport.initialize());

//serialize the use based on user_id
passport.serializeUser(function (user, done) {
  done(null, user.id);
})

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
 * passport local login strategy start here
 */

var strategyOptions = {
  usernameField: 'email'
};

var loginStrategy = new LocalStrategy(strategyOptions, function (email, password, done) {
  var searchUser = {
    email: email
  };

  User.findOne(searchUser, function (err, user) {
    if (err) {
      return done(err)
    };

    if (!user) {
      return done(null, false, {
        message: 'Wrong email/password'
      });
    }
    user.comparePasswords(password, function (err, isMatch) {
      if (err) {
        return done(err)
      };

      if (!isMatch) {
        return done(null, false, {
          message: 'Wrong email/password'
        });
      } else {
        return done(null, user);
      }

    });

  })
});
/*
 * end here
 */

/*
 * passport local register strategy start here
 */
var registerStrategy = new LocalStrategy(strategyOptions, function(email, password, done) {

  var searchUser = {
    email: email
  };

  User.findOne(searchUser, function (err, user) {
    if (err) {
      return done(err)
    };

    if (user) {
      return done(null, false, {
        message: 'email already exists'
      });
    }

    var newUser = new User({
      email: email,
      password: password
    });

    newUser.save(function (err) {
      done(null, newUser);

    })
  });
});
/*
 * end here
 */

passport.use('local-register', registerStrategy);
passport.use('local-login', loginStrategy);


/*
 * using bcrypt-nodejs module to hash password - start here
 */

var UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  googleId: String,
  displayName: String
})

//hide the password when response - start here

UserSchema.methods.toJSON = function () {
  var user = this.toObject();
  delete user.password;

  return user;
}
//end here

//compare password start here 
UserSchema.methods.comparePasswords = function (password, callback) {
  bcrypt.compare(password, this.password, callback);
}
//end here

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

/*
 * user register endpoint start here
 */
app.post('/register',passport.authenticate('local-register'), function (req, res) {
  createSendToken(req.user, res);
});
/*
 * end here
 */

/*
 * login endpoint start here
 */
app.post('/login', passport.authenticate('local-login'), function (req, res) {
  createSendToken(req.user, res);
})

/*
 * end here
 */


/*
 * function to create and send token- start here
 */
function createSendToken(user, res) {
  var payload = {
    sub: user.id,
    exp: moment().add(10, 'days').unix()  // token expiration
  }

  var token = jwt.encode(payload, "secret_key");

  res.status(200).send({
    user: user.toJSON(),
    token: token
  });
}
/*
 * end here
 */


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

/*
 * Google auth  start here
 */

app.post('/auth/google', function(req, res) {

  var url = 'https://accounts.google.com/o/oauth2/token';
  var apiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';

  var params = {
    client_id: req.body.clientId,
    redirect_uri: req.body.redirectUri,
    code: req.body.code,
    grant_type: 'authorization_code',
    client_secret: 'kJVeyUgEyfZXcXmPe0Sds_tQ'
  }

  request.post(url, {
    json: true,
    form: params
  }, function(err, response, token) {
    var accessToken = token.access_token;
    var headers = {
      Authorization: 'Bearer' + accessToken
    }

    request.get({
      url: apiUrl, 
      header: headers, 
      json: true
    }, function(err, response, profile) {
      //search for a user with googleId
      User.findOne({googleId: profile.sub}, function(err, foundUser) {
        if (foundUser) return createSendToken(foundUser, res);

        //create new user
        var newUser = new User();
        newUser.googleId = profile.sub;
        newUser.displayName = profile.name;
        newUser.save(function(err) {
          if(err) return next(err);
          createSendToken(newUser, res);
        })
      })
    })

  });
});

 /*
 * end here
 */

mongoose.connect('mongodb://localhost/jwtAngularNodeApp');

var server = app.listen(3000, function () {
  console.log('api is listening on ', server.address().port);
})