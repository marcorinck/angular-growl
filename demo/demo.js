var app = angular.module("demo", ["angular-growl"]);

app.config(["growlProvider", "$httpProvider", function(growlProvider, $httpProvider) {
	console.log(growlProvider);
	growlProvider.globalTimeToLive(2000);
	$httpProvider.responseInterceptors.push(growlProvider.serverMessagesInterceptor);
}]);

app.controller("demoCtrl", function demoCtrl($scope, growl) {
	$scope.createMessage = function () {
		var config = {};
		if ($scope.timeout) {
			config.ttl = $scope.timeout;
		}

		if ($scope.alertType === "success") {
			growl.addSuccessMessage($scope.message, config);
		}

		if ($scope.alertType === "warn") {
			growl.addWarnMessage($scope.message, config);
		}

		if ($scope.alertType === "info") {
			growl.addInfoMessage($scope.message, config);
		}

		if ($scope.alertType === "error") {
			growl.addErrorMessage($scope.message, config);
		}
	}
});