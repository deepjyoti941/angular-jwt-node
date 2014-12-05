'use strict';

angular.module('jwtAngularNodeApp')
.controller('LogoutCtrl', function ($auth, $state) {
	$auth.logout();
	$state.go('main');
});