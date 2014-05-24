angular.module("angular-growl").directive("growl", ["$rootScope", function ($rootScope) {
	"use strict";

	return {
		restrict: 'A',
		template:   '<div class="growl">' +
					'	<div ng-repeat="message in messages" ng-class="{{classes}}">' +
					'		<button type="button" class="close" ng-click="deleteMessage(message)">&times;</button>' +
					'       <div ng-switch="message.enableHtml">' +
					'           <div ng-switch-when="true" ng-bind-html="message.text"></div>' +
					'           <div ng-switch-default ng-bind="message.text"></div>' +
					'       </div>' +
					'	</div>' +
					'</div>',
		replace: false,
		scope: true,
		controller: ['$scope', '$timeout', 'growl', function ($scope, $timeout, growl) {
			var onlyUnique = growl.onlyUnique();

			$scope.messages = [];
			$scope.classes = ['growl-item', 'alert'];
			
			function addMessage(message) {
				$scope.messages.push(message);

				if (message.ttl && message.ttl !== -1) {
					$timeout(function () {
						$scope.deleteMessage(message);
					}, message.ttl);
				}
			}
			$rootScope.$on("growlMessage", function (event, message) {
				var found;
				
				// Add classes based on message type
				switch(message.severity){
				case 'success':
				    $scope.classes.push('alert-success');
				    break;
				case 'error':
				    $scope.classes.push('alert-danger');
				    break;
				case 'info':
				    $scope.classes.push('alert-info');
				    break;
				case 'warn':
				    $scope.classes.push('alert-warning');
				    break;
				default:
				    break;
				}
				
				// Add any custom classes
				if(message.classes)
					$scope.classes.push(message.classes);

				if (onlyUnique) {
					angular.forEach($scope.messages, function(msg) {
						if (message.text === msg.text && message.severity === msg.severity) {
							found = true;
						}
					});

					if (!found) {
						addMessage(message);
					}
				} else {
					addMessage(message);
				}
			});

			$scope.deleteMessage = function (message) {
				var index = $scope.messages.indexOf(message);
				if (index > -1) {
					$scope.messages.splice(index, 1);
				}

			};
		}]
	};
}]);
