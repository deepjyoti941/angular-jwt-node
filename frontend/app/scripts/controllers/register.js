'use strict';

angular.module('jwtAngularNodeApp')
  .controller('RegisterCtrl', function ($scope, $rootScope, $http, alert) {
    $scope.submit = function () {
      var url = 'http://localhost:3000/register';
      var user = {
        name: 'Deepjyoti'
      };
      $http.post(url, user)
        .success(function (res) {
          alert('success', 'OK!', 'You are now registered');
        })
        .error(function (err) {
          alert('warning', 'Opps!', 'Could not register');
        });
    };
  });