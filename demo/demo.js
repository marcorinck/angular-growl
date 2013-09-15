angular.module("demo", ["angular-growl"]).controller("demoCtrl", function demoCtrl($scope, growl) {
	$scope.createMessage = function () {
		if ($scope.alertType === "success") {
			growl.addSuccessMessage($scope.message);
		}

		if ($scope.alertType === "warn") {
			growl.addWarnMessage($scope.message);
		}

		if ($scope.alertType === "info") {
			growl.addInfoMessage($scope.message);
		}

		if ($scope.alertType === "error") {
			growl.addErrorMessage($scope.message);
		}
	}
});