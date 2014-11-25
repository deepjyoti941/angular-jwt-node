'use strict';

angular.module('jwtAngularNodeApp')
  .controller('RegisterCtrl', function ($scope, alert, auth) {
    $scope.submit = function () {
      auth.register($scope.email, $scope.password)
        .success(function (res) {
          alert('success', 'Account Created!', 'Welcome, ' + res.user.email + ' !');
        })
        .error(function (err) {
          alert('warning', 'Some went wrong!', err.message);
        });
    };
  });