'use strict';

angular.module('jwtAngularNodeApp').config(function ($urlRouterProvider, $stateProvider, $httpProvider) {

  $urlRouterProvider.otherwise('/');

  $stateProvider

  .state('main', {
    url: '/',
    templateUrl: '/views/main.html'
  })

  .state('register', {
    url: '/register',
    templateUrl: '/views/register.html',
    controller: 'RegisterCtrl'
  })

  .state('login', {
    url: '/login',
    templateUrl: '/views/login.html',
    controller: 'LoginCtrl'
  })

  .state('jobs', {
    url: '/jobs',
    templateUrl: '/views/jobs.html',
    controller: 'JobsCtrl'
  })

  .state('logout', {
    url: '/logout',
    controller: 'LogoutCtrl'
  });

  $httpProvider.interceptors.push('authInterceptor');
})

.constant('API_URL', 'http://localhost:3000/')

.run(function ($window) {
  var params = $window.location.search.substring();

  //checking if params is valid and we actualy in window popup instead of main window
  if (params && $window.opener && $window.opener.location.origin === $window.location.origin) {
    var pair = params.split('=');
    var code = decodeURIComponent(pair[1]);

    $window.opener.postMessage(code, $window.location.origin)
  };
});