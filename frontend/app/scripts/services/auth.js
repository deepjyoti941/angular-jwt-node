'use strict';

angular.module('jwtAngularNodeApp')
  .service('auth', function ($http, API_URL, authToken, $state) {

    function authSuccessfull(res) {
      authToken.setToken(res.token);
      $state.go('main');
    }

    this.login = function (email, password) {
      return $http.post(API_URL + 'login', {
        email: email,
        password: password
      }).success(authSuccessfull);
    }

    this.register = function (email, password) {
      return $http.post(API_URL + 'register', {
        email: email,
        password: password
      }).success(authSuccessfull);
    }

  });