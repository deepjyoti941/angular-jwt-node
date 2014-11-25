'use strict';

angular.module('jwtAngularNodeApp')
  .controller('LoginCtrl', function ($scope, alert, auth) {
    $scope.submit = function () {

      auth.login($scope.email, $scope.password)
        .success(function (res) {
          alert('success', 'Welcome', 'Thanks for comming back ' + res.user.email + ' !');
        })
        .error(function (err) {
          alert('warning', 'Some went wrong!', err.message);
        });
    };
  });