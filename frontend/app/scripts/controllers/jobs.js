'use strict';

angular.module('jwtAngularNodeApp')
  .controller('JobsCtrl', function ($scope) {
    $scope.jobs = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });