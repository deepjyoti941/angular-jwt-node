'use strict';

angular.module('jwtAngularNodeApp')
  .controller('LoginCtrl', function ($scope, alert, auth) {
    $scope.submit = function () {

      auth.login($scope.email, $scope.password)
        .success(function (res) {
          alert('success', 'Welcome', 'Thanks for comming back ' + res.user.email + ' !');
        })
        .error(handleError);
    };

    $scope.google = function() {
      auth.googleAuth().then(function(res) {
        alert('success', 'Welcome', 'Thanks for comming back ' + res.user.displayName + ' !');
      },handleError);
    }
    function handleError(err) {
      alert('warning', 'Some went wrong!', err.message);
    }
  });