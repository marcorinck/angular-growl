#angular-growl

> growl like notifications for angularJS projects, using bootstrap alert classes

##Features

![Standard bootstrap 2.x styles](doc/screenshot.jpg)

* growl like notifications like in MacOS X
* using standard bootstrap classes (alert, alert-info, alert-error, alert-success)
* global or per message configuration of a timeout when message will be automatically closed
* automatic translation of messages if [angular-translate](https://github.com/PascalPrecht/angular-translate) filter is
present, you only have to provide keys as messages, angular-translate will translate them
* pre-defined $http-Interceptor to automatically handle $http responses for server-sent messages
* < 1 kB after GZIP

##Changelog

**0.2.0** - 22nd Sept 2013

* reworking, bugfixing and documenting handling of server sent messages/notifications
* externalizing css styles of growl class
* provide minified versions of js and css files in build folder

**0.1.3**  - 20th Sept 2013

* introducing ttl config option, fixes #2

##Installation

You can install angular-growl with bower:

> bower install angular-growl

Alternatively you can download the files in the [build folder](build/) manually and include them in your project.

````html
<html>
    <head>
        <link href="bootstrap.min.css" rel="stylesheet">
        <script src="angular.min.js"></script>

        <link href="angular-growl.css" rel="stylesheet">
        <script src="angular-growl.js"></script>
    </head>
</html>
````

As angular-growl is based on its own angularJS module, you have to alter your dependency list when creating your application
module:

````javascript
var app = angular.module('myApp', ['angular-growl']);
````

Finally, you have to include the directive somewhere in your HTML like this:

````html
<body>
    <div growl></div>
</body>
````

##Usage

Just let angular inject the growl Factory into your code and call the 4 functions that the factory provides accordingly:

````javascript
app.controller("demoCtrl", ['$scope', 'growl', function($scope, growl) {
    $scope.addSpecialWarnMessage = function() {
        growl.addWarnMessage("This adds a warn message");
        growl.addInfoMessage("This adds a info message");
        growl.addSuccessMessage("This adds a success message");
        growl.addErrorMessage("This adds a error message");
    }
}]);
````

If [angular-translate](https://github.com/PascalPrecht/angular-translate) is present, its filter is automatically called for translating of messages, so you have to provide
only the key:

````javascript
app.controller("demoCtrl", ['$scope', 'growl', function($scope, growl) {
    $scope.addSpecialWarnMessage = function() {
        growl.addSuccessMessage("SAVE_SUCCESS_MESSAGE");
        growl.addErrorMessage("VALIDATION_ERROR");
    }
}]);
````

##Configuration

###Automatic closing of notifications (timeout, ttl)
Standard behaviour is, that all notifications need to be closed manually by the user.

However, you can configure a global timeout (TTL) after which notifications should be automatically closed.  To do
this, you have to configure this during config phase of angular bootstrap like this:

````javascript
var app = angular.module('myApp', ['angular-growl']);

app.config(['growlProvider', function(growlProvider) {
    growlProvider.globalTimeToLive(5000);
}]);
````

This sets a global timeout of 5 seconds after which every notification will be closed.

You can override TTL generally for every single message if you want:

````javascript
app.controller("demoCtrl", ['$scope', 'growl', function($scope, growl) {
    $scope.addSpecialWarnMessage = function() {
        growl.addWarnMessage("Override global ttl setting", {ttl: 10000});
    }
}]);
````

This sets a 10 second timeout, after which the notification will be automatically closed.

If you have set a global TTL, you can disable automatic closing of single notifications by setting their ttl to -1:

````javascript
app.controller("demoCtrl", ['$scope', 'growl', function($scope, growl) {
    $scope.addSpecialWarnMessage = function() {
        growl.addWarnMessage("this will not be closed automatically even when a global ttl is set", {ttl: -1});
    }
}]);
````
###Handling of server sent notifications

When doing $http requests, you can configure angular-growl to look automatically for messages in $http responses, so your
business logic on the server is able to send messages/notifications to the client and you can display them automagically:

````javascript
var app = angular.module('myApp', ['angular-growl']);

app.config(['growlProvider', '$httpProvider', function(growlProvider, $httpProvider) {
    $httpProvider.responseInterceptors.push(growlProvider.serverMessagesInterceptor);
}]);
````

This adds a pre-defined angularJS HTTP interceptor that is called on every HTTP request and looks if response contains
messages. Messages from the server need to satisfy these requirements:

* response needs to have a "messages" attribute of type array in root of response
* every message needs to have these attributes:
  * text - message text
  * severity - severity of message, needs to be one of the following strings: "warn", "info", "error", "success"

Server messages will be created with default TTL.
