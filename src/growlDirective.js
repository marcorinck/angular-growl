angular.module("angular-growl").directive("growl", ["$rootScope", "$sce",
  function($rootScope, $sce) {
    "use strict";

    return {
      restrict: 'A',
      templateUrl: 'templates/growl/growl.html',
      replace: false,
      scope: {
        reference: '@',
        inline: '@'
      },
      controller: ['$scope', '$timeout', 'growl',
        function($scope, $timeout, growl) {
          var onlyUnique = growl.onlyUnique();
          $scope.messages = [];
          var referenceId = $scope.reference || 0;
          $scope.inlineMessage = $scope.inline || growl.inlineMessages();

          function addMessage(message) {
            $timeout(function() {
              message.text = $sce.trustAsHtml(String(message.text));

              /** abillity to reverse order (newest first ) **/
              if(growl.reverseOrder())
              {
                  $scope.messages.unshift(message);
              } else {
                  $scope.messages.push(message);
              }


              if (message.ttl && message.ttl !== -1) {
                $timeout(function() {
                  $scope.deleteMessage(message);
                }, message.ttl);
              }
            }, true);
          }

          $rootScope.$on("growlMessage", function(event, message) {
            var found;
            var msgText;
            if (parseInt(referenceId, 10) === parseInt(message.referenceId, 10)) {
              if (onlyUnique) {
                angular.forEach($scope.messages, function(msg) {
                  msgText = $sce.getTrustedHtml(msg.text);
                  if (message.text === msgText && message.severity === msg.severity && msg.title === msg.title) {
                    found = true;
                  }
                });

                if (!found) {
                  addMessage(message);
                }
              } else {
                addMessage(message);
              }
            }
          });

          $scope.deleteMessage = function(message) {
            var index = $scope.messages.indexOf(message);
            if (index > -1) {
              $scope.messages.splice(index, 1);
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
  $templateCache.put("templates/growl/growl.html",
    '<div class="growl-container" ng-class="wrapperClasses()">' +
      '<div class="growl-item alert" ng-repeat="message in messages" ng-class="alertClasses(message)">' +
        '<button type="button" class="close" data-dismiss="alert" aria-hidden="true" ng-click="deleteMessage(message)" ng-show="!message.disableCloseButton">&times;</button>' +
        '<h4 class="growl-title" ng-show="message.title" ng-bind="message.title"></h4>' +
        '<div class="growl-message" ng-bind-html="message.text"></div>' +
      '</div>' +
    '</div>'
  );
}]);
