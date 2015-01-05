#angular-growl-2
Growl like notifications for angularJS projects, using bootstrap alert classes, originally developed by Marco Rinck

##Features

![Standard bootstrap 2.x styles](doc/screenshot.jpg)

* growl like notifications like in MacOS X
* using standard bootstrap classes (alert, alert-info, alert-error, alert-success)
* global or per message configuration of a timeout when message will be automatically closed
* automatic translation of messages if [angular-translate](https://github.com/PascalPrecht/angular-translate) filter is
present, you only have to provide keys as messages, angular-translate will translate them
* pre-defined $http-Interceptor to automatically handle $http responses for server-sent messages
* automatic CSS animations when adding/closing notifications (only when using >= angularJS 1.2)
* < 1 kB after GZIP
* Allows for HTML content inside the alert
* Possible to use multiple growl directives that show their notification inline
* Icons for the different alert types (can be disabled)
* Possible to set an optional title
* Server side variable interpolation
* Lots of configuration possible!

##Installation

You can install angular-growl-v2 with bower:

> bower install angular-growl-v2

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
    growl.warning("This adds a warn message");
    growl.info("This adds a info message");
    growl.success("This adds a success message");
    growl.error("This adds a error message");
  }
}]);
````

The title must be set as a configuration parameter:

````javascript
app.controller("demoCtrl", ['$scope', 'growl', function($scope, growl) {
  $scope.addSpecialWarnMessage = function() {
    growl.warning("This adds a warn message", {title: 'Warning!'});
    growl.info("This adds a info message", {title: 'Random Information'});
    growl.success("This adds a success message"); //no title here
    growl.error("This adds a error message", {title: 'ALERT WE GOT ERROR'});
  }
}]);
````

If [angular-translate](https://github.com/PascalPrecht/angular-translate) is present, its filter is automatically called for translating of messages, so you have to provide
only the key:

````javascript
app.controller("demoCtrl", ['$scope', 'growl', function($scope, growl) {
  $scope.addSpecialWarnMessage = function() {
      growl.success("SAVE_SUCCESS_MESSAGE");
      growl.error("VALIDATION_ERROR");
  }
}]);
````

## Configuration/Documentation/Info
For the configuration options, documentation and live examples visit the github pages:

## [http://janstevens.github.io/angular-growl-2/](http://janstevens.github.io/angular-growl-2/)

Live demo's can be found on the following codepen collection:

## [Codepen Collection](http://codepen.io/collection/Jhcpi/)

## Contributions
* Fork the project
* Change/Fix/Add the stuff you want
* Clone the codepens that have effect on your changes or if you add new features create a codepen that show them
* Create a PR
* Don't forget to add your name to the Thanks section!

# Thanks
Thanks Marco Rinck for the original code, the following people have contributed to this project:

* [orangeskins](https://github.com/orangeskins)
* [adamalbrecht](https://github.com/adamalbrecht)
* [m0ppers](https://github.com/m0ppers)
* [lbehnke](https://github.com/lbehnke)
* [rorymadden](https://github.com/rorymadden)
* [pauloprea](https://github.com/pauloprea)
* [tlvince](https://github.com/tlvince)
* [vik-singh](https://github.com/vik-singh)
* [Anaphase](https://github.com/Anaphase)
* [soumya92](https://github.com/soumya92)
* [willjk](https://github.com/willjk)

# License
Copyright (C) 2015 Marco Rinck

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
