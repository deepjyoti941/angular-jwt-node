'use strict';

angular.module('jwtAngularNodeApp')
  .controller('RegisterCtrl', function ($scope, alert, $auth) {
    $scope.submit = function () {
      $auth.signup({email: $scope.email, password: $scope.password})
        .then(function (res) {
          alert('success', 'Account Created!', 'Welcome, ' + res.data.user.email + ' ! Please activate your email account in the next several days');
        })
        .catch(function (err) {
          alert('warning', 'Some went wrong!', err.message);
        });
    };
  });
