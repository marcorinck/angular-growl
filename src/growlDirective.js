angular.module("angular-growl").directive("growl", ["$rootScope", "$sce",
  function($rootScope, $sce) {
    "use strict";

    return {
      restrict: 'A',
      template: '<div ng-class="computeContainerClasses()">' +
        ' <div class="growl-item alert" ng-repeat="message in messages" ng-class="computeClasses(message)">' +
        '   <button type="button" class="close" ng-click="deleteMessage(message)" ng-show="!message.disableCloseButton">&times;</button>' +
        '       <div ng-switch="message.enableHtml">' +
        '           <h4 ng-show="!message.enableTitle" ng-bind="computeTitle(message)"></h4>' +
        '           <div ng-switch-when="true" ng-bind-html="message.text"></div>' +
        '           <div ng-switch-default ng-bind="message.text"></div>' +
        '       </div>' +
        ' </div>' +
        '</div>',
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
          $scope.position = growl.Position();
          function addMessage(message) {
            if (message.enableHtml) {
              message.text = $sce.trustAsHtml(message.text);
            }
            $scope.messages.push(message);

            if (message.ttl && message.ttl !== -1) {
              $timeout(function() {
                $scope.deleteMessage(message);
              }, message.ttl);
            }
          }
          $rootScope.$on("growlMessage", function(event, message) {
            var found;
            if (parseInt(referenceId, 10) === parseInt(message.referenceId, 10)) {
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
            }
          });

          $scope.deleteMessage = function(message) {
            var index = $scope.messages.indexOf(message);
            if (index > -1) {
              $scope.messages.splice(index, 1);
            }

          };

          $scope.computeClasses = function(message) {
            return {
              'alert-success': message.severity === "success",
              'alert-error': message.severity === "error", //bootstrap 2.3
              'alert-danger': message.severity === "error", //bootstrap 3
              'alert-info': message.severity === "info",
              'alert-warning': message.severity === "warn" //bootstrap 3, no effect in bs 2.3
            };
          };

          $scope.computeContainerClasses = function(){
            var ret = {
              'growl': !this.inlineMessage,
            };
            ret[this.position] = true;
            return ret
          };

          $scope.computeTitle = function(message){
            var ret = {
              'success': 'Success',
              'error': 'Error',
              'info': 'Information',
              'warn': 'Warning'
            }
            return ret[message.severity];
          }
        }
      ]
    };
  }
]);
