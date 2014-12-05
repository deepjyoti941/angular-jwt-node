'use strict';

angular.module('jwtAngularNodeApp')
  .controller('HeaderCtrl', function ($scope, $auth) {
    $scope.isAuthenticated = $auth.isAuthenticated;
  });