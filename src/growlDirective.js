angular.module("angular-growl").directive("growl", ["$rootScope", "$sce",
  function($rootScope, $sce) {
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
      controller: ['$scope', '$timeout', 'growl',
        function($scope, $timeout, growl) {
          var onlyUnique = growl.onlyUnique();
          $scope.messages = [];
          var referenceId = $scope.reference || 0;
          $scope.inlineMessage = $scope.inline || growl.inlineMessages();

          function addMessage(message) {
            $timeout(function() {
              var found;
              var msgText;

              if (onlyUnique) {
                angular.forEach($scope.messages, function(msg) {
                  msgText = $sce.getTrustedHtml(msg.text);
                  if (message.text === msgText &&
                        message.severity === msg.severity &&
                          msg.title === msg.title) {
                    found = true;
                  }
                });

                if (found) {
                  return;
                }
              }

              message.text = $sce.trustAsHtml(String(message.text));

              /**If message closes on timeout, add's promises array for
                timeouts to stop close. Also sets message.closeoutTimer to ttl / 1000
              **/
              if(message.ttl && message.ttl !== -1) {
                message.countdown = message.ttl / 1000;
                message.promises = [];
                message.close = false;
                message.countdownFunction = function() {
                  if(message.countdown > 1){
                    message.countdown--;
                    message.promises.push($timeout(message.countdownFunction, 1000));
                  } else {
                    message.countdown--;
                  }
                };
              }

              /** Limit the amount of messages in the container **/
              if (angular.isDefined($scope.limitMessages)) {
                var diff = $scope.messages.length - ($scope.limitMessages - 1);
                if (diff > 0) {
                  $scope.messages.splice($scope.limitMessages - 1, diff);
                }
              }

              /** abillity to reverse order (newest first ) **/
              if (growl.reverseOrder()) {
                $scope.messages.unshift(message);
              } else {
                $scope.messages.push(message);
              }

              if(typeof(message.onopen) === 'function') {
                message.onopen();
              }

              if (message.ttl && message.ttl !== -1) {
                //adds message timeout to promises and starts messages countdown function.
                message.promises.push($timeout(function() {
                  $scope.deleteMessage(message);
                }, message.ttl));
                message.promises.push($timeout(message.countdownFunction, 1000));
              }
            }, true);
          }

          $rootScope.$on("growlMessage", function(event, message) {
            if (parseInt(referenceId, 10) === parseInt(message.referenceId, 10)) {
              addMessage(message);
            }
          });

          $scope.deleteMessage = function(message) {
            var index = $scope.messages.indexOf(message);
            if (index > -1) {
              $scope.messages.splice(index, 1);
            }

            if(typeof(message.onclose) === 'function') {
              message.onclose();
            }

          };

          //Cancels all promises within message apon deleting message or stop deleting.
          $scope.stopTimeoutClose = function(message){
            angular.forEach(message.promises, function(promise){
              $timeout.cancel(promise);
            });
            if(message.close){
              $scope.deleteMessage(message);
            } else {
              message.close = true;
            }
          };

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
        '<div class="growl-item alert" ng-repeat="message in messages" ng-class="alertClasses(message)" ng-click="stopTimeoutClose(message)">' +
          '<button type="button" class="close" data-dismiss="alert" aria-hidden="true" ng-click="deleteMessage(message)" ng-show="!message.disableCloseButton">&times;</button>' +
          '<button type="button" class="close" aria-hidden="true" ng-show="showCountDown(message)">{{message.countdown}}</button>' +
          '<h4 class="growl-title" ng-show="message.title" ng-bind="message.title"></h4>' +
          '<div class="growl-message" ng-bind-html="message.text"></div>' +
        '</div>' +
      '</div>'
    );
  }
}]);
