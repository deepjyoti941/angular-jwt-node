'use strict';

angular.module('jwtAngularNodeApp')
  .controller('LoginCtrl', function ($scope, alert, auth, $auth ) {
    $scope.submit = function () {

      $auth.login({email: $scope.email, password: $scope.password})
        .then(function (res) {
          alert('success', 'Welcome', 'Thanks for comming back ' + res.data.user.email + ' !');
        })
        .catch(handleError);
    };

    $scope.authenticate = function(provider) {
      $auth.authenticate(provider).then(function(res) {
        alert('success', 'Welcome', 'Thanks for comming back ' + res.data.user.displayName + ' !');
      },handleError);
    }
    function handleError(err) {
      alert('warning', 'Some went wrong!', err.message);
    }
  });