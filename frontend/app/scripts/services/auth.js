'use strict';

angular.module('jwtAngularNodeApp')
  .service('auth', function ($http, API_URL, authToken, $state, $window, $q) {

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

    var clientId = '376843532263-ksso136ivtl50mjnomou7tonagttu7e1.apps.googleusercontent.com';
    var urlBuilder = [];
    urlBuilder.push('response_type=code',
                    'client_id=' + clientId,
                    'redirect_uri=' + window.location.origin,
                    'scope=profile email');
    this.googleAuth = function () {
      var url = "https://accounts.google.com/o/oauth2/auth?" + urlBuilder.join('&');
      var options = "width=500, height=500, left="+ ($window.outerWidth - 500) / 2 + ",top="+ ($window.outerWidth - 500) / 2.5;
      
      var deferred = $q.defer();

      var popup = $window.open(url, '', options);
      $window.focus();

      $window.addEventListener('message', function(event) {
        if (event.origin === $window.location.origin) {
          var code = event.data;
          popup.close();

          $http.post(API_URL + 'auth/google', { 
            code: code,
            clientId: clientId,
            redirectUri: window.location.origin
          }).success(function(jwt) {
            authSuccessfull(jwt);
            deferred.resolve(jwt); //resolve the deferred to send back the promise
          });
        };
      });

      return deferred.promise;
    }

  });