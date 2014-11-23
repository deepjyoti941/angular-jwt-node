'use strict';

angular.module('jwtAngularNodeApp').factory('authToken', function ($window) {
  var storage = $window.localStorage;
  var cachedToken;
  return {
    setToken: function (token) {
      cachedToken = token;
      storage.setItem('userToken', token);
    },
    getToken: function () {
      if (!cachedToken)
        cachedToken = storage.getItem('userToken');

      return cachedToken;
    },
    isAuthenticated: function () {

      // !! it takes the result cast it to bool and then inverse it
      // here it will return true if we dont get any thing from getToken()
      return !!this.getToken();
    }
  };
});