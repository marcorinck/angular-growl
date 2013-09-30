angular.module("angular-growl").directive("growl", ["$rootScope", function ($rootScope) {
    "use strict";

    return {
        restrict: 'A',
        template:   '<div class="growl">' +
                    '	<div class="growl-item alert" ng-repeat="message in messages" ng-class="computeClasses(message)">' +
                    '		<button type="button" class="close" ng-click="deleteMessage(message)">&times;</button>' +
                    '           <div ng-switch="message.enableHtml">' +
                    '               <div ng-switch-when="true" ng-bind-html="message.text"></div>' +
                    '               <div ng-switch-default ng-bind="message.text"></div>' +
                    '           </div>' +
                    '	</div>' +
                    '</div>',
        replace: false,
        scope: true,
        controller: function ($scope, $timeout) {
            $scope.messages = [];

            $rootScope.$on("growlMessage", function (event, message) {
                $scope.messages.push(message);
                if (message.ttl && message.ttl !== -1) {
                    $timeout(function () {
                        $scope.deleteMessage(message);
                    }, message.ttl);
                }
            });

            $scope.deleteMessage = function (message) {
                var index = $scope.messages.indexOf(message);
                if (index > -1) {
                    $scope.messages.splice(index, 1);
                }

            };

            $scope.computeClasses = function (message) {
                return {
                    'alert-success': message.isSuccess,
                    'alert-error': message.isError,
                    'alert-info': message.isInfo
                };
            };
        }
    };
}]);
