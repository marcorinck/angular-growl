var app = angular.module("demo", ["angular-growl", "ngAnimate", "ngMockE2E"]);

app.config(["growlProvider", "$httpProvider", function(growlProvider, $httpProvider) {
	growlProvider.globalTimeToLive(2000);
	growlProvider.messagesKey("my-messages");
	growlProvider.messageTextKey("messagetext");
	growlProvider.messageSeverityKey("severity-level");
	growlProvider.onlyUniqueMessages(true);
	$httpProvider.responseInterceptors.push(growlProvider.serverMessagesInterceptor);


}]);

app.run(function($httpBackend) {
	//mocking backend to simulate handling server messages
	$httpBackend.when('GET', '/mockbackend').respond({
		someData: "fhsdfshfshdfs",
		"my-messages": [
			{"messagetext":"this is a server message", "severity-level": "warn"},
			{"messagetext":"this is another server message", "severity-level": "info"},
			{"messagetext":"and another", "severity-level": "error"}
		]
	});
});

app.controller("demoCtrl",  function demoCtrl($scope, growl, $http) {

	$scope.createMessage = function () {
		var config = {};
		if ($scope.timeout) {
			config.ttl = $scope.timeout;
		}
		if ($scope.enableHtml) {
			config.enableHtml = $scope.enableHtml;
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
	};

	$scope.simulateServerMessages= function() {
		$http.get("/mockbackend").then(function(data) {
			console.log(data);
		});
	};
});