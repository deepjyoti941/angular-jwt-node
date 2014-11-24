'use strict';

angular.module('jwtAngularNodeApp')
  .controller('LoginCtrl', function ($scope, $http, API_URL, alert, authToken) {
    $scope.submit = function () {
      var url = API_URL + 'login';
      var user = {
        email: $scope.email,
        password: $scope.password
      };
      $http.post(url, user)
        .success(function (res) {
          alert('success', 'Welcome', 'Thanks for comming back ' + res.user.email + ' !');
          authToken.setToken(res.token);
        })
        .error(function (err) {
          alert('warning', 'Some went wrong!', err.message);
        });
    };
  });