angular.module('angular-growl', [])
	.config(['$httpProvider', function ($httpProvider) {
		$httpProvider.responseInterceptors.push(['$q', 'growl', function ($q, growl) {
			function success(response) {
				if (response.messages) {
					growl.addServerMessages(response.messages);
				}
				return response;
			}

			function error(response) {
				if (response.messages) {
					growl.addServerMessages(response.messages);
				}

				return $q.reject(response);

			}

			return function (promise) {
				return promise.then(success, error);
			};
		}]);
	}]);