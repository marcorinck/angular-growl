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

##Configuration

###Reverse ordered messages [default: false]

Ability to reverse order of messages (default ordering is newest on the bottom ).

````javascript
var app = angular.module('myApp', ['angular-growl']);

app.config(['growlProvider', function(growlProvider) {
  growlProvider.globalReversedOrder(true);
}]);
````

###Only unique messages [default: true]

Accept only unique messages as a new message. If a message is already displayed (text and severity are the same) then this
message will not be added to the displayed message list. Set to false, to always display all messages regardless if they
are already displayed or not. Uniqueness of messages is determined by the message text, severity and title:

````javascript
var app = angular.module('myApp', ['angular-growl']);

app.config(['growlProvider', function(growlProvider) {
  growlProvider.onlyUniqueMessages(false);
}]);
````

###Automatic closing of notifications (timeout, ttl) [default: none]

However, you can configure a global timeout (TTL) after which notifications should be automatically closed.  To do this, you have to configure this during config phase of angular bootstrap like this:

````javascript
var app = angular.module('myApp', ['angular-growl']);

app.config(['growlProvider', function(growlProvider) {
  growlProvider.globalTimeToLive(5000);
}]);
````
This sets a global timeout of 5 seconds after which every notification will be closed. It's also possible to provide the tll based on the severity of the message. To do this, you configure `growlProvider` as follows:

```javascript
app.config(['growlProvider', function(growlProvider) {
  growlProvider.globalTimeToLive({success: 2000, error: 5000, warning: 2000, info: 2000})
}])
```

This sets the success messages to 5 seconds and all the others to 2 seconds.You can override TTL generally for every single message if you want:

````javascript
app.controller("demoCtrl", ['$scope', 'growl', function($scope, growl) {
  $scope.addSpecialWarnMessage = function() {
    growl.warning("Override global ttl setting", {ttl: 10000});
  }
}]);
````

This sets a 10 second timeout, after which the notification will be automatically closed.

If you have set a global TTL, you can disable automatic closing of single notifications by setting their ttl to -1:

````javascript
app.controller("demoCtrl", ['$scope', 'growl', function($scope, growl) {
  $scope.addSpecialWarnMessage = function() {
    growl.warning("this will not be closed automatically even when a global ttl is set", {ttl: -1});
  }
}]);
````

###Allow HTML in messages [always-on]

Starting from v0.6, HTML can always be included in the message text (not the title). It uses `$sce` service from angular to mark the html as trusted. The following example shows the html usage.

````javascript
app.controller("demoCtrl", ['$scope', 'growl', function($scope, growl) {
  $scope.addSpecialWarnMessage = function() {
    growl.warning("<strong>This is a HTML message</strong>");
  }
}]);
````

###Disable Icons in messages [default: false]
The icons are hardcoded as base64 string in the css file. The original images can be found in the src/images folder. The following code will disable the icons globally.

```javascript
var app = angular.module('myApp', ['angular-growl']);

app.config(['growlProvider', function(growlProvider) {
  growlProvider.globalDisableIcons(true);
}]);
```

You can override the global options and show icons for specific messages by using the following code:

 ````javascript
 app.controller("demoCtrl", ['$scope', 'growl', function($scope, growl) {
  $scope.addSpecialWarnMessage = function() {
    growl.warning("<strong>This is a message with a icon", {disableIcons: false});
  }
 }]);
 ````

###Disable close button on messages [default: false]
Turn this on to hide the close button on messages, default behaviour is to display the close button.

```javascript
var app = angular.module('myApp', ['angular-growl']);

app.config(['growlProvider', function(growlProvider) {
  growlProvider.globalDisableCloseButton(true);
}]);
```

You can override the global option and hide the close button in single messages too:

 ````javascript
 app.controller("demoCtrl", ['$scope', 'growl', function($scope, growl) {
  $scope.addSpecialWarnMessage = function() {
    growl.warning("<strong>This is a message without a close button</strong>", {disableCloseButton: true});
  }
 }]);
 ````

###Position [default:top-right]
Instruct where the messages while appear relative to the screen
>Options: top-left, top-right, bottom-left, bottom-right, top-center, bottom-center

````javascript
var app = angular.module('myApp', ['angular-growl']);

app.config(['growlProvider', function(growlProvider) {
  growlProvider.globalPosition('bottom-center');
});
````

###Inline Messages [default: false]
Turn this on globally or on the directive to allow inline messages instead of the growl like messages. The default behaviour is to show growl like messages.

```javascript
var app = angular.module('myApp', ['angular-growl']);

app.config(['growlProvider', function(growlProvider) {
  growlProvider.globalInlineMessages(true);
});
```

You can override the global option by specifing a display method on the directive, you can also use this in combination with reference id option:

```html
<form>
  <div growl inline="true"></div>
  <label>Name:<label><input type="text" name="name" />
</form>
```

###Reference ID [default: 0]
When using inline growl notifications, it is possible to have multiple growl directives. For this reason it is possible to define a referenceId on the directive. When sending a message give it the same referenceId as the one in the directive configuration. Example:

```javascript
app.controller("demoCtrl", ['$scope', 'growl', function($scope, growl) {
  $scope.sendToGrowl = function(referenceId) {
    growl.warning("This is only send to growl directive with referenceId = 1", {referenceId: referenceId});
    }
}]);
```

```html
<div growl inline="true" reference="1"></div>
<div growl inline="true" reference="2"></div>
<div growl inline="true" reference="3"></div>
<button ng-click="sendToGrowl(1)">Send to Growl #1</button>
```
When the user clicks on the button in the example, only the first growl directive will show the message inline. For bigger forms with multiple parts, this can be very handy.

When no ID is given the default 0 will be used.

###Animations

Beginning with angularJS 1.2 growl messages can be automatically animated with CSS animations when adding and/or closing them. All you have to do is load the angular-animate.js provided by angularJS and add **ngAnimate** to your applications dependency list:

````html
<html>
  <head>
    <link href="bootstrap.min.css" rel="stylesheet">
    <script src="angular.min.js"></script>
    <script src="angular-animate.min.js"></script>

    <link href="angular-growl.css" rel="stylesheet">
      <script src="angular-growl.js"></script>
  </head>
</html>
````

````javascript
var app = angular.module('myApp', ['angular-growl', 'ngAnimate']);
````

That's it. The angular-growl.css comes with a pre-defined animation of 0.5s to opacity.

To configure the animations, just change the _.growl-container > .growl-item.*_ classes in the css file to your preference. F.i. to change length
of animation from 0.5s to 1s do this:

````css
.growl-container > .growl-item.ng-enter,
.growl-container > .growl-item.ng-leave {
  -webkit-transition:1s linear all;
  -moz-transition:1s linear all;
  -o-transition:1s linear all;
  transition:1s linear all;
}
````

Basically you can style your animations just as you like if ngAnimate can pick it up automatically. See the [ngAnimate
docs](http://docs.angularjs.org/api/ngAnimate) for more info.

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
messages. Interceptor looks in response for a "messages" array of objects with "text", "title" and "severity" key. This is an example
response which results in 3 growl messages:

````json
{
    "someOtherData": {...},
	"messages": [
		{"text":"this is a server message", "severity": "warn"},
		{"text":"this is another server message", "severity": "info"},
		{"text":"and another", "severity": "error", "title" : "Server side errors!"}
	]
}
````

You can configure the keys, the interceptor is looking for like this:

````javascript
var app = angular.module("demo", ["angular-growl"]);

app.config(["growlProvider", "$httpProvider", function(growlProvider, $httpProvider) {
	growlProvider.messagesKey("my-messages");
	growlProvider.messageTextKey("messagetext");
  growlProvider.messageTitleKey("message_title");
	growlProvider.messageSeverityKey("severity-level");
	$httpProvider.responseInterceptors.push(growlProvider.serverMessagesInterceptor);
}]);
````

Server messages will be created with default TTL.

## Customization
It is possible to replace the template of the growlDirective. The template is stored in the `$templateCache` and has the following html:

```HTML
<div class="growl-container" ng-class="wrapperClasses()">
  <div class="growl-item alert" ng-repeat="message in messages" ng-class="alertClasses(message)">
    <button type="button" class="close" ng-click="deleteMessage(message)" ng-show="!message.disableCloseButton">&times;</button>
    <h4 class="growl-title" ng-show="message.title" ng-bind="message.title"></h4>
    <div class="growl-message" ng-bind-html="message.text"></div>
  </div>
</div>
```

Overwriting the template can be done by defining your own `templates/growl/growl.html` in the templateCache:

```javascript
<script type="text/ng-template" id="templates/growl/growl.html">
// your template here
</script>
```

A safer option to alter the view of the growl notifications is to change the css. The following classes are defined:
* growl-container: the main div that holds all the growl messages for the directive
* growl-item: a individual growl notification item
* growl-title: the title of the notification
* growl-message: the message of the notification

The icons used in the notification are included in the css as base64 strings. The original images (white and colored) can be found in the src/images folder.

##Changelog
**0.6.1** - 25 May 2014
* Fixes edge case where message test is not a string
* Fixes style issue where close button was floating outside the alert
* Fixes issue [#12](https://github.com/JanStevens/angular-growl-2/issues/12), [#15](https://github.com/JanStevens/angular-growl-2/issues/15), [#16](https://github.com/JanStevens/angular-growl-2/issues/16)

**0.6.0** - 16 Apr 2014
* [CHANGE] remove enableHtml, `$sce.trustAsHtml` is always run on the message text
* Possible to set global possition for non-inline growl messages (thanks @pauloprea)
* Template can now easily be replace or styled with CSS
* Include icons for the different notifications, can be disabled globally or per notification
* Server side messages can now interpolate variables into the message ([original pull request](https://github.com/marcorinck/angular-growl/pull/19))


**0.5.3** - 19 Mar 2014
* Fixed bug where globalInlineMessage option would not work globally

**0.5.2** - 19 Mar 2014
* Added an option to show notifications inline instead of growl like behaviour (very handy for forms)
* Added a referenceId field so different inline growl directives can be targeted
* Converted tabs to spaces
* Updated the demo site to show the new changes

**0.5.0** - 18 Mar 2014
* Manually merged some pull requests from the original branch
* Fixed bower.json file to include itself and the css file
* [BREAK] changed the function names to add growl notifications to be a shorter (success, info, warning, error VS addSuccessMessage, addInfoMessage...)

**0.4.0** - 19th Nov 2013

* updated dependency to angularJS 1.2.x, angular-growl does not work with 1.0.x anymore (BREAKING CHANGE)
* new option: only display unique messages, which is the new default, disable to allow same message more than once (BREAKING CHANGE)
* new option: allow html tags in messages, default is off  you need to

**0.3.1** - 1st Oct 2013

* bugfix: translating of messages works again
* change: also set alert css classes introduced by bootstrap 3

**0.3.0** - 26th Sept 2013

* adding css animations support via ngAnimate (for angularJS >= 1.2)
* ability to configure server message keys

**0.2.0** - 22nd Sept 2013

* reworking, bugfixing and documenting handling of server sent messages/notifications
* externalizing css styles of growl class
* provide minified versions of js and css files in build folder

**0.1.3**  - 20th Sept 2013

* introducing ttl config option, fixes #2

#Thanks
Thanks Marco Rinck for the original code, the following people have contributed to this project:

* [orangeskins](https://github.com/orangeskins)
* [adamalbrecht](https://github.com/adamalbrecht)
* [m0ppers](https://github.com/m0ppers)
* [lbehnke](https://github.com/lbehnke)
* [rorymadden](https://github.com/rorymadden)

# License
Copyright (C) 2014 Marco Rinck

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
