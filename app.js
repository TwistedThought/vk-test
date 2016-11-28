(function () {
"use strict";

angular.module('MyVkApp', ['ngCookies'])
.controller('Controller', Controller)
.service('Service', Service)
.directive('friend', FriendDirective)
.controller('IndexController', IndexController);

function FriendDirective() {
	var ddo = {
		templateUrl: 'friend.html',
		scope: {
			ctrl: '<friends'
		}
	};
	return ddo;
};

Controller.$inject = ['Service', '$cookies'];
function Controller(Service, $cookies) {
	var ctrl = this;

	var hash = window.location.hash.split('&');
	var token = hash[0].split('=')[1];
	$cookies.put('myVKappCookie', token);

	var profilePromise = Service.get_profile(token);
	profilePromise.then(function(result) {
		ctrl.profile = result;
	}).catch(function(error) {
		console.log('Something went wrong');
	});

	var friendsPromise = Service.get_friends(token);
	friendsPromise.then(function(result) {
		ctrl.friends = result;
	}).catch(function(error) {
		console.log('Something went wrong');
	});

};

Service.$inject = ['$http'];
function Service($http) {
	var service = this;

	service.get_profile = function(token) {
		var href = "https://api.vk.com/method/users.get?callback=JSON_CALLBACK&v=5.60&access_token=" + token;
		return $http.jsonp(href).then(function(response) {
				var info = response.data.response[0];
				return info;
			});
	};

	service.get_friends = function(token) {
		var href = "https://api.vk.com/method/friends.get?callback=JSON_CALLBACK&order=random&count=5&fields=photo_100&v=5.60&access_token=" + token;
		return $http.jsonp(href).then(function(response) {
				var friends = response.data.response.items;
				return friends;
			});
	};
};

IndexController.$inject = ['$cookies'];
function IndexController($cookies) {
	var tokenCookie = $cookies.get('myVKappCookie');
	var href = "https://twistedthought.github.io/vk-test/friends.html#access_token="+tokenCookie+"&expires_in=0";
	if (tokenCookie) {
		window.location.assign(href);
	};
};

})();