"use strict";

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
      {"messagetext":"{{field}} this is a server message", "severity-level": "warning",  "variables": {"field":"first name"}},
      {"messagetext":"this is another server message", "severity-level": "info"},
      {"messagetext":"and another", "severity-level": "error", "title" : "Server Side Error"}
    ]
  });
});

app.controller("demoCtrl",  function demoCtrl($scope, growl, $http) {

  $scope.createMessage = function () {
    var config = {};
    config.title = "awesome title";
    if ($scope.timeout) {
      config.ttl = $scope.timeout;
    }
    if ($scope.enableHtml) {
      config.enableHtml = $scope.enableHtml;
    }

    if ($scope.alertType === "success") {
      growl.success($scope.message, config);
    }

    if ($scope.alertType === "warn") {
      growl.warning($scope.message, config);
    }

    if ($scope.alertType === "info") {
      growl.info($scope.message, config);
    }

    if ($scope.alertType === "error") {
      growl.error($scope.message, config);
    }
  };

  $scope.inlineMessage = function(id) {
    growl.success("Inline Message!", {referenceId: id});
  };

  $scope.simulateServerMessages= function() {
    $http.get("/mockbackend").then(function(data) {
      console.log(data);
    });
  };
});
