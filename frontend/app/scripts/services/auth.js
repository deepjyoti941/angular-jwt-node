'use strict';

angular.module('jwtAngularNodeApp')
  .service('auth', function ($http, API_URL, authToken) {
    var url = API_URL + 'login';

    this.login = function (email, password) {
      return $http.post(url, {
        email: email,
        password: password
      }).success(function (res) {
        authToken.setToken(res.token);
      });
    }
  });