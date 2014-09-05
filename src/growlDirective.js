angular.module("angular-growl").directive("growl", [
  function() {
    "use strict";

    return {
      restrict: 'A',
      templateUrl: 'templates/growl/growl.html',
      replace: false,
      scope: {
        reference: '@',
        inline: '@',
        limitMessages : '='
      },
      controller: ['$scope', '$timeout', 'growl', 'growlMessages',
        function($scope, $timeout, growl, growlMessages) {
          growlMessages.init($scope.reference, $scope.inline, growl.onlyUnique(), growl.reverseOrder());
          $scope.growlMessages = growlMessages;
          $scope.inlineMessage = $scope.inline || growl.inlineMessages();

          $scope.$watch('limitMessages', function(limitMessages) {
            if (!angular.isUndefined(limitMessages)) {
              growlMessages.limitMessages = limitMessages;
            }
          });

          $scope.alertClasses = function(message) {
            return {
              'alert-success': message.severity === "success",
              'alert-error': message.severity === "error", //bootstrap 2.3
              'alert-danger': message.severity === "error", //bootstrap 3
              'alert-info': message.severity === "info",
              'alert-warning': message.severity === "warning", //bootstrap 3, no effect in bs 2.3
              'icon' : message.disableIcons === false,
              'alert-dismissable' : !message.disableCloseButton
            };
          };

          $scope.showCountDown = function(message) {
            return !message.disableCountDown && message.ttl > 0;
          };

          $scope.wrapperClasses = function(){
            var classes = {};
            classes['growl-fixed'] = !$scope.inlineMessage;
            classes[growl.position()] = true;
            return classes;
          };

          $scope.computeTitle = function(message){
            var ret = {
              'success': 'Success',
              'error': 'Error',
              'info': 'Information',
              'warn': 'Warning'
            };
            return ret[message.severity];
          };
        }
      ]
    };
  }
]);

angular.module("angular-growl").run(['$templateCache', function($templateCache) {
  "use strict";
  if ($templateCache.get('templates/growl/growl.html') === undefined) {
    $templateCache.put("templates/growl/growl.html",
      '<div class="growl-container" ng-class="wrapperClasses()">' +
        '<div class="growl-item alert" ng-repeat="message in growlMessages.messages" ng-class="alertClasses(message)" ng-click="stopTimeoutClose(message)">' +
          '<button type="button" class="close" data-dismiss="alert" aria-hidden="true" ng-click="growlMessages.deleteMessage(message)" ng-show="!message.disableCloseButton">&times;</button>' +
          '<button type="button" class="close" aria-hidden="true" ng-show="showCountDown(message)">{{message.countdown}}</button>' +
          '<h4 class="growl-title" ng-show="message.title" ng-bind="message.title"></h4>' +
          '<div class="growl-message" ng-bind-html="message.text"></div>' +
        '</div>' +
      '</div>'
    );
  }
}]);
